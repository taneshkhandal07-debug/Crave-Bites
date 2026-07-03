import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { razorpay } from "@/lib/razorpay";

export async function POST(req: NextRequest) {
  try {
    // 1. Authenticate user
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await db.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // 2. Parse request body
    const { items, restaurantId, deliveryAddress } = await req.json();

    if (!items || !Array.isArray(items) || items.length === 0 || !restaurantId || !deliveryAddress) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // 3. Double-check item prices from DB securely to prevent client-side tampering
    const menuItemIds = items.map((i) => i.id);
    const dbItems = await db.menuItem.findMany({
      where: {
        id: { in: menuItemIds },
        restaurantId: restaurantId,
      },
    });

    if (dbItems.length !== menuItemIds.length) {
      return NextResponse.json({ error: "Some items do not belong to this restaurant" }, { status: 400 });
    }

    let subtotal = 0;
    for (const item of items) {
      const dbItem = dbItems.find((d) => d.id === item.id);
      if (!dbItem) {
        return NextResponse.json({ error: `Item ${item.name} not found` }, { status: 400 });
      }
      subtotal += dbItem.price * item.quantity;
    }

    const deliveryFee = 40;
    const taxes = Math.round(subtotal * 0.05 * 100) / 100; // 5% GST
    const totalAmount = Math.round((subtotal + deliveryFee + taxes) * 100) / 100;

    // 4. Check for mock key placeholders
    const rzpKey = process.env.RAZORPAY_KEY_ID;
    const rzpSecret = process.env.RAZORPAY_KEY_SECRET;
    const isMock = !rzpKey || rzpKey === "rzp_test_yourkeyhere" || !rzpSecret || rzpSecret === "your_secret_here";

    let razorpayOrderId = "";

    if (isMock) {
      razorpayOrderId = `order_mock_${Date.now()}`;
    } else {
      try {
        const rzpOrder = await razorpay.orders.create({
          amount: Math.round(totalAmount * 100), // Razorpay accepts in Paisa (cents)
          currency: "INR",
          receipt: `receipt_cb_${Date.now()}`,
        });
        razorpayOrderId = rzpOrder.id;
      } catch (err) {
        console.error("Razorpay order creation failed, falling back to mock:", err);
        // Fallback to mock if API call fails
        razorpayOrderId = `order_mock_${Date.now()}`;
      }
    }

    // 5. Create PENDING Order in Database
    const order = await db.order.create({
      data: {
        userId: user.id,
        restaurantId,
        totalAmount,
        status: "PENDING",
        deliveryAddress,
        paymentStatus: "PENDING",
        razorpayOrderId: razorpayOrderId,
        orderItems: {
          create: items.map((item) => {
            const dbItem = dbItems.find((d) => d.id === item.id)!;
            return {
              menuItemId: item.id,
              quantity: item.quantity,
              price: dbItem.price,
            };
          }),
        },
      },
    });

    return NextResponse.json({
      orderId: order.id,
      razorpayOrderId,
      amount: totalAmount,
      isMock: isMock || razorpayOrderId.startsWith("order_mock_"),
      keyId: isMock ? "rzp_test_yourkeyhere" : rzpKey,
      currency: "INR",
    });

  } catch (error) {
    console.error("Order creation API error:", error);
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
  }
}

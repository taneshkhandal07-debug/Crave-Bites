import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  try {
    // 1. Authenticate user
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. Parse request body
    const { razorpayOrderId, razorpayPaymentId, razorpaySignature } = await req.json();

    if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
      return NextResponse.json({ error: "Missing verification signatures" }, { status: 400 });
    }

    // 3. Find the pending order
    const order = await db.order.findFirst({
      where: {
        razorpayOrderId: razorpayOrderId,
      },
    });

    if (!order) {
      return NextResponse.json({ error: "Order record not found" }, { status: 404 });
    }

    // 4. Verify signature (Bypass check for mock vs. crypto check for real keys)
    let isSignatureValid = false;

    if (razorpayOrderId.startsWith("order_mock_")) {
      // Mock Signature validation
      isSignatureValid = razorpaySignature === "mock_signature";
    } else {
      // Real Signature validation
      const secret = process.env.RAZORPAY_KEY_SECRET;
      if (!secret || secret === "your_secret_here") {
        // Fallback check if keys were changed mid-way
        isSignatureValid = razorpaySignature === "mock_signature";
      } else {
        const text = `${razorpayOrderId}|${razorpayPaymentId}`;
        const generatedSignature = crypto
          .createHmac("sha256", secret)
          .update(text)
          .digest("hex");
        
        isSignatureValid = generatedSignature === razorpaySignature;
      }
    }

    // 5. Update Database order status based on payment verification success
    if (isSignatureValid) {
      await db.order.update({
        where: { id: order.id },
        data: {
          status: "PREPARING",
          paymentStatus: "SUCCESS",
          razorpayPaymentId: razorpayPaymentId,
          razorpaySignature: razorpaySignature,
        },
      });

      return NextResponse.json({ success: true, orderId: order.id });
    } else {
      await db.order.update({
        where: { id: order.id },
        data: {
          paymentStatus: "FAILED",
        },
      });

      return NextResponse.json({ error: "Payment signature verification failed" }, { status: 400 });
    }

  } catch (error) {
    console.error("Order verification API error:", error);
    return NextResponse.json({ error: "Failed to verify payment" }, { status: 500 });
  }
}

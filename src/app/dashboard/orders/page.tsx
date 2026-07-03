import React from "react";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import OrdersClient from "./OrdersClient";

export const metadata = {
  title: "Order History | CraveBite",
  description: "View your order history and track active deliveries.",
};

async function getUserOrders(userId: string) {
  try {
    const orders = await db.order.findMany({
      where: {
        userId: userId,
      },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        restaurant: {
          select: {
            name: true,
          },
        },
        orderItems: {
          include: {
            menuItem: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });
    return orders;
  } catch (error) {
    console.error("Error fetching user orders:", error);
    return [];
  }
}

export default async function OrdersPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    redirect("/login?callbackUrl=/dashboard/orders");
  }

  const user = await db.user.findUnique({
    where: { email: session.user.email },
    select: { id: true },
  });

  if (!user) {
    redirect("/login?callbackUrl=/dashboard/orders");
  }

  const orders = await getUserOrders(user.id);

  return (
    <div className="orders-page-wrapper">
      <OrdersClient orders={orders as any} />
    </div>
  );
}

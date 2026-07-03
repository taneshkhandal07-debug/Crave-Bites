import React from "react";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import CheckoutClient from "./CheckoutClient";

export const metadata = {
  title: "Checkout | CraveBite",
  description: "Complete your order securely.",
};

export default async function CheckoutPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    redirect("/login?callbackUrl=/checkout");
  }

  const user = await db.user.findUnique({
    where: { email: session.user.email },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      defaultAddress: true,
    },
  });

  if (!user) {
    redirect("/login?callbackUrl=/checkout");
  }

  return (
    <main className="checkout-page-container container" style={{ padding: "120px 24px 80px 24px" }}>
      <div className="catalog-header mb-4">
        <h1 className="catalog-title">Secure Checkout</h1>
        <p className="catalog-subtitle text-secondary">
          Review your items, choose a delivery location, and make payment securely.
        </p>
      </div>

      <CheckoutClient 
        user={{
          name: user.name || "",
          email: user.email || "",
          phone: user.phone || "",
          defaultAddress: user.defaultAddress || "",
        }} 
      />
    </main>
  );
}

import React from "react";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import AddressesClient from "./AddressesClient";

export const metadata = {
  title: "Delivery Addresses | CraveBite",
  description: "Manage your default delivery address and contact details.",
};

export default async function AddressesPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    redirect("/login?callbackUrl=/dashboard/addresses");
  }

  const user = await db.user.findUnique({
    where: { email: session.user.email },
    select: {
      phone: true,
      defaultAddress: true,
    },
  });

  if (!user) {
    redirect("/login?callbackUrl=/dashboard/addresses");
  }

  return (
    <div className="addresses-page-wrapper">
      <AddressesClient 
        initialUser={{
          phone: user.phone || "",
          defaultAddress: user.defaultAddress || "",
        }} 
      />
    </div>
  );
}

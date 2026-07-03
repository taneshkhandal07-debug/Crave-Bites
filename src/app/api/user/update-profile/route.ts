import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    // 1. Authenticate user
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. Parse request parameters
    const { defaultAddress, phone } = await req.json();

    // 3. Update database record
    await db.user.update({
      where: {
        email: session.user.email,
      },
      data: {
        defaultAddress: defaultAddress || null,
        phone: phone || null,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Profile update API error:", error);
    return NextResponse.json({ error: "Failed to update profile coordinates" }, { status: 500 });
  }
}

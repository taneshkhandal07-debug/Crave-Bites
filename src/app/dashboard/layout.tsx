import React from "react";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import SidebarNav from "./SidebarNav";
import "./dashboard.css";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // 1. Authenticate server-side
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    redirect("/login?callbackUrl=/dashboard");
  }

  // 2. Fetch basic profile info
  const user = await db.user.findUnique({
    where: { email: session.user.email },
    select: {
      name: true,
      role: true,
    },
  });

  return (
    <div className="container" style={{ padding: "120px 24px 80px 24px" }}>
      <div className="dashboard-grid">
        {/* Shared Left Sidebar Nav */}
        <aside className="dashboard-sidebar">
          <div className="glass-card p-4">
            <div 
              className="user-profile-header mb-4" 
              style={{ 
                textAlign: "center", 
                borderBottom: "1px solid var(--border-color)", 
                paddingBottom: "20px" 
              }}
            >
              <div 
                className="avatar-placeholder text-gradient mb-2" 
                style={{ 
                  fontSize: "2rem", 
                  margin: "0 auto 12px auto", 
                  background: "rgba(255, 107, 53, 0.08)", 
                  width: "68px", 
                  height: "68px", 
                  borderRadius: "50%", 
                  display: "flex", 
                  alignItems: "center", 
                  justifyContent: "center" 
                }}
              >
                👤
              </div>
              <h3 style={{ fontSize: "16px", fontWeight: 800, color: "var(--text-primary)" }}>
                {user?.name || "Customer"}
              </h3>
              <span 
                className="badge" 
                style={{ 
                  fontSize: "10.5px", 
                  marginTop: "6px", 
                  background: "rgba(255, 255, 255, 0.03)", 
                  border: "1px solid var(--border-color)",
                  color: "var(--text-secondary)"
                }}
              >
                {user?.role || "CUSTOMER"}
              </span>
            </div>
            
            <SidebarNav />
          </div>
        </aside>

        {/* Right Dashboard Sub-Views Content */}
        <div className="dashboard-main-content">
          {children}
        </div>
      </div>
    </div>
  );
}

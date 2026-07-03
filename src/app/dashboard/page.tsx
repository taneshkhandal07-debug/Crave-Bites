import React from "react";
import Link from "next/link";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { 
  ShoppingBag, 
  MapPin, 
  Sparkles, 
  ArrowRight,
  TrendingUp,
  Clock
} from "lucide-react";

export default async function DashboardPage() {
  // 1. Authenticate user session
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    redirect("/login?callbackUrl=/dashboard");
  }

  // 2. Load User Profile coordinates
  const user = await db.user.findUnique({
    where: { email: session.user.email },
    select: {
      id: true,
      name: true,
      phone: true,
      defaultAddress: true,
    },
  });

  if (!user) {
    redirect("/login?callbackUrl=/dashboard");
  }

  // 3. Fetch stats metrics
  const totalOrders = await db.order.count({
    where: { userId: user.id },
  });

  const activeOrdersCount = await db.order.count({
    where: {
      userId: user.id,
      NOT: [
        { status: "DELIVERED" },
        { status: "CANCELLED" },
      ],
    },
  });

  // 4. Fetch the 3 most recent orders
  const recentOrders = await db.order.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    take: 3,
    include: {
      restaurant: {
        select: {
          name: true,
        },
      },
    },
  });

  // Helper to format date
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // Helper for status badge style classes
  const getStatusClass = (status: string) => {
    switch (status.toUpperCase()) {
      case "PENDING":
        return "status-pending";
      case "PREPARING":
        return "status-preparing";
      case "OUT_FOR_DELIVERY":
        return "status-out_for_delivery";
      case "DELIVERED":
        return "status-delivered";
      default:
        return "status-cancelled";
    }
  };

  return (
    <div className="overview-page-wrapper">
      {/* Welcome Greeting Banner */}
      <div className="welcome-banner">
        <h1 className="text-gradient">Hello, {user.name || "Foodie"}!</h1>
        <p>
          Hungry for something delicious? Track your current orders or browse our partner restaurants to grab your next meal.
        </p>
        <div style={{ position: "absolute", right: "20px", bottom: "-10px", fontSize: "6rem", opacity: 0.15, pointerEvents: "none" }}>
          🍔
        </div>
      </div>

      {/* Overview Statistics Cards */}
      <div className="stats-row">
        {/* Stat Item 1 */}
        <div className="stat-card glass-card">
          <div className="stat-icon-wrapper">
            <ShoppingBag size={24} />
          </div>
          <div className="stat-info">
            <h3>{totalOrders}</h3>
            <p>Total Orders</p>
          </div>
        </div>

        {/* Stat Item 2 */}
        <div className="stat-card glass-card">
          <div className="stat-icon-wrapper" style={{ background: "rgba(56, 176, 0, 0.1)", color: "var(--accent-green)" }}>
            <TrendingUp size={24} />
          </div>
          <div className="stat-info">
            <h3>{activeOrdersCount}</h3>
            <p>Active Deliveries</p>
          </div>
        </div>

        {/* Stat Item 3 */}
        <div className="stat-card glass-card">
          <div className="stat-icon-wrapper" style={{ background: "rgba(255, 183, 3, 0.1)", color: "var(--accent-yellow)" }}>
            <MapPin size={24} />
          </div>
          <div className="stat-info">
            <h3 
              style={{ 
                fontSize: "14px", 
                fontWeight: 700, 
                whiteSpace: "nowrap", 
                overflow: "hidden", 
                textOverflow: "ellipsis", 
                maxWidth: "140px" 
              }}
              title={user.defaultAddress || "None set"}
            >
              {user.defaultAddress ? user.defaultAddress.split(",")[0] : "Not set"}
            </h3>
            <p>Delivery Location</p>
          </div>
        </div>
      </div>

      {/* Recent Orders Section */}
      <div className="recent-orders-section mt-4">
        <div className="section-header flex-between mb-3" style={{ display: "flex" }}>
          <h2 className="dashboard-sec-title" style={{ margin: 0 }}>
            Recent Orders
          </h2>
          {totalOrders > 0 && (
            <Link href="/dashboard/orders" className="btn btn-secondary" style={{ padding: "6px 12px", fontSize: "13px" }}>
              <span>View History</span>
              <ArrowRight size={14} />
            </Link>
          )}
        </div>

        {recentOrders.length === 0 ? (
          <div className="glass-card p-5 text-center flex-center flex-column" style={{ background: "rgba(255,255,255,0.01)" }}>
            <span style={{ fontSize: "3rem" }}>🍗</span>
            <h3 className="mt-3">No orders placed yet</h3>
            <p className="text-secondary mt-1">Order food from local restaurants to start your culinary journey.</p>
            <Link href="/restaurants" className="btn btn-primary mt-4">
              Explore Restaurants
            </Link>
          </div>
        ) : (
          <div className="orders-list-wrapper">
            {recentOrders.map((order) => (
              <div key={order.id} className="glass-card p-4 flex-between order-history-card" style={{ display: "flex", gap: "20px" }}>
                <div className="flex-start gap-4" style={{ display: "flex", flexWrap: "wrap" }}>
                  <div className="info-block">
                    <span>Restaurant</span>
                    <strong>{order.restaurant.name}</strong>
                  </div>
                  <div className="info-block">
                    <span>Order Date</span>
                    <strong>{formatDate(order.createdAt)}</strong>
                  </div>
                  <div className="info-block">
                    <span>Total Amount</span>
                    <strong>₹{order.totalAmount.toFixed(2)}</strong>
                  </div>
                  <div className="info-block">
                    <span>Status</span>
                    <div>
                      <span className={`status-badge ${getStatusClass(order.status)}`}>
                        {order.status}
                      </span>
                    </div>
                  </div>
                </div>
                
                <Link href="/dashboard/orders" className="btn btn-secondary" style={{ padding: "8px 14px", fontSize: "13px" }}>
                  Track Order
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick Explore banner */}
      {recentOrders.length > 0 && (
        <div 
          className="glass-card p-4 mt-5 flex-between" 
          style={{ 
            display: "flex", 
            background: "linear-gradient(135deg, rgba(20,20,24,0.6) 0%, rgba(255,107,53,0.02) 100%)",
            gap: "20px"
          }}
        >
          <div className="flex-start gap-3" style={{ display: "flex", alignItems: "center" }}>
            <span style={{ fontSize: "2rem" }}>🥗</span>
            <div>
              <h4 style={{ fontWeight: 800 }}>Explore more cravings?</h4>
              <p className="text-secondary" style={{ fontSize: "13.5px", marginTop: "2px" }}>Find new dishes and restaurants serving in your neighborhood.</p>
            </div>
          </div>
          <Link href="/restaurants" className="btn btn-primary" style={{ padding: "10px 20px" }}>
            Browse Menu
          </Link>
        </div>
      )}
    </div>
  );
}

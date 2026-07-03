"use client";

import React, { useState } from "react";
import { 
  ChevronDown, 
  ChevronUp, 
  ShoppingBag, 
  Utensils, 
  Calendar,
  CheckCircle,
  Truck,
  Flame,
  Clock
} from "lucide-react";

interface OrderItem {
  id: string;
  quantity: number;
  price: number;
  menuItem: {
    name: string;
  };
}

interface Order {
  id: string;
  totalAmount: number;
  status: string;
  deliveryAddress: string;
  createdAt: string | Date;
  restaurant: {
    name: string;
  };
  orderItems: OrderItem[];
}

interface OrdersClientProps {
  orders: Order[];
}

export default function OrdersClient({ orders }: OrdersClientProps) {
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(
    orders.length > 0 ? orders[0].id : null
  );

  const toggleExpand = (orderId: string) => {
    setExpandedOrderId(expandedOrderId === orderId ? null : orderId);
  };

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

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

  // Live tracking details resolver
  const getTrackingProgressClass = (status: string) => {
    switch (status.toUpperCase()) {
      case "PENDING":
        return "pct-0";
      case "PREPARING":
        return "pct-33";
      case "OUT_FOR_DELIVERY":
        return "pct-66";
      case "DELIVERED":
        return "pct-100";
      default:
        return "pct-0";
    }
  };

  const isOrderActive = (status: string) => {
    const s = status.toUpperCase();
    return s === "PENDING" || s === "PREPARING" || s === "OUT_FOR_DELIVERY";
  };

  return (
    <div className="orders-page-content-wrapper">
      <h2 className="dashboard-sec-title">
        <Utensils size={22} className="text-gradient" />
        <span>Your Orders</span>
      </h2>

      {orders.length === 0 ? (
        <div className="glass-card p-5 text-center flex-center flex-column">
          <span style={{ fontSize: "3rem" }}>🥡</span>
          <h3 className="mt-3">No orders placed yet</h3>
          <p className="text-secondary mt-1">Start order food from local cuisines nearby.</p>
        </div>
      ) : (
        <div className="orders-list-wrapper">
          {orders.map((order) => {
            const isExpanded = expandedOrderId === order.id;
            const activeTracking = isOrderActive(order.status);
            const statusUpper = order.status.toUpperCase();

            return (
              <div key={order.id} className="glass-card order-history-card">
                {/* Order Header Card - Accordion Trigger */}
                <div 
                  className="order-card-header flex-between" 
                  onClick={() => toggleExpand(order.id)}
                  style={{ display: "flex", flexWrap: "wrap", gap: "16px" }}
                >
                  <div className="order-info-group">
                    <div className="info-block">
                      <span>Order ID</span>
                      <strong>{order.id.slice(-8).toUpperCase()}</strong>
                    </div>
                    <div className="info-block">
                      <span>Vendor</span>
                      <strong>{order.restaurant.name}</strong>
                    </div>
                    <div className="info-block">
                      <span>Placed On</span>
                      <strong>{formatDate(order.createdAt).split(" at")[0]}</strong>
                    </div>
                    <div className="info-block">
                      <span>Paid Amount</span>
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

                  <div className="accordion-arrow flex-center" style={{ color: "var(--text-muted)" }}>
                    {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                  </div>
                </div>

                {/* Accordion Expandable Body */}
                {isExpanded && (
                  <div className="order-details-body">
                    {/* Active Order Live Tracker */}
                    {activeTracking && (
                      <div className="live-tracker-wrapper">
                        <div className="tracker-title">
                          <Clock size={16} className="animate-float" />
                          <span>Live Delivery Tracking</span>
                        </div>
                        
                        <div className="tracker-steps">
                          {/* Connector Overlay Line */}
                          <div className={`progress-connector ${getTrackingProgressClass(order.status)}`}></div>

                          {/* Step 1: Placed */}
                          <div className={`tracker-step ${statusUpper === "PENDING" ? "active" : "completed"}`}>
                            <div className="step-indicator">
                              <ShoppingBag size={14} />
                            </div>
                            <span className="step-label">Placed</span>
                          </div>

                          {/* Step 2: Preparing */}
                          <div className={`tracker-step ${
                            statusUpper === "PREPARING" 
                              ? "active" 
                              : (statusUpper === "OUT_FOR_DELIVERY" || statusUpper === "DELIVERED") 
                                ? "completed" 
                                : ""
                          }`}>
                            <div className="step-indicator">
                              <Flame size={14} />
                            </div>
                            <span className="step-label">Preparing</span>
                          </div>

                          {/* Step 3: Out for Delivery */}
                          <div className={`tracker-step ${
                            statusUpper === "OUT_FOR_DELIVERY" 
                              ? "active" 
                              : statusUpper === "DELIVERED" 
                                ? "completed" 
                                : ""
                          }`}>
                            <div className="step-indicator">
                              <Truck size={14} />
                            </div>
                            <span className="step-label">On the Way</span>
                          </div>

                          {/* Step 4: Delivered */}
                          <div className={`tracker-step ${statusUpper === "DELIVERED" ? "completed" : ""}`}>
                            <div className="step-indicator">
                              <CheckCircle size={14} />
                            </div>
                            <span className="step-label">Delivered</span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Order items List */}
                    <div className="order-items-table">
                      <h4 className="mb-2" style={{ fontSize: "14px", textTransform: "uppercase", letterSpacing: "0.03em", color: "var(--text-muted)" }}>
                        Items Ordered
                      </h4>
                      {order.orderItems.map((item) => (
                        <div key={item.id} className="order-item-row">
                          <div className="order-item-title-desc">
                            <span className="order-item-name">{item.menuItem.name}</span>
                            <span className="order-item-qty">x {item.quantity}</span>
                          </div>
                          <span className="order-item-price">₹{(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>

                    {/* Footer note */}
                    <div className="order-details-footer">
                      <div className="delivery-note">
                        <span>Delivering to:</span> <strong className="text-primary">{order.deliveryAddress}</strong>
                      </div>
                      <div className="total-indicator" style={{ textAlign: "right" }}>
                        <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>Grand Total:</span>
                        <h3 className="text-gradient" style={{ fontSize: "1.5rem", fontWeight: 850 }}>₹{order.totalAmount.toFixed(2)}</h3>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

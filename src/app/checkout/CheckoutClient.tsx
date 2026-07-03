"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { 
  ShoppingCart, 
  MapPin, 
  Phone, 
  ShieldCheck, 
  AlertCircle, 
  X, 
  CheckCircle,
  CreditCard
} from "lucide-react";

interface CheckoutClientProps {
  user: {
    name: string;
    email: string;
    phone: string;
    defaultAddress: string;
  };
}

export default function CheckoutClient({ user }: CheckoutClientProps) {
  const router = useRouter();
  const { items, restaurantName, clearCart, totalAmount, restaurantId } = useCart();

  const [address, setAddress] = useState(user.defaultAddress || "");
  const [phone, setPhone] = useState(user.phone || "");
  
  // Validation / Loading States
  const [addressError, setAddressError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Sandbox Simulator Modal States
  const [showSandboxModal, setShowSandboxModal] = useState(false);
  const [paymentOrderDetails, setPaymentOrderDetails] = useState<{
    orderId: string;
    razorpayOrderId: string;
    amount: number;
    currency: string;
    isMock: boolean;
    keyId: string;
  } | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);

  // Price calculations
  const subtotal = totalAmount;
  const deliveryFee = items.length > 0 ? 40 : 0;
  const taxes = Math.round(subtotal * 0.05 * 100) / 100; // 5% GST
  const total = Math.round((subtotal + deliveryFee + taxes) * 100) / 100;

  const validateForm = () => {
    let isValid = true;
    if (!address.trim()) {
      setAddressError("Delivery address is required");
      isValid = false;
    } else {
      setAddressError("");
    }

    if (!phone.trim()) {
      setPhoneError("Phone number is required");
      isValid = false;
    } else if (!/^\+?[0-9]{10,14}$/.test(phone.replace(/\s+/g, ""))) {
      setPhoneError("Please enter a valid phone number (10-12 digits)");
      isValid = false;
    } else {
      setPhoneError("");
    }

    return isValid;
  };

  // Helper to load Razorpay SDK dynamically
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (!validateForm()) return;

    setIsPlacingOrder(true);

    try {
      // 1. Create order record on backend
      const res = await fetch("/api/payments/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((i) => ({ id: i.id, quantity: i.quantity, price: i.price, name: i.name })),
          restaurantId,
          deliveryAddress: address.trim(),
        }),
      });

      const orderData = await res.json();

      if (!res.ok || orderData.error) {
        throw new Error(orderData.error || "Failed to initiate payment");
      }

      setPaymentOrderDetails(orderData);

      // 2. Redirect to Mock Sandbox or trigger Razorpay Checkout
      if (orderData.isMock) {
        setShowSandboxModal(true);
        setIsPlacingOrder(false);
      } else {
        const scriptLoaded = await loadRazorpayScript();
        if (!scriptLoaded) {
          throw new Error("Razorpay SDK failed to load. Please verify your internet connection.");
        }

        const options = {
          key: orderData.keyId,
          amount: Math.round(orderData.amount * 100), // convert to paisa
          currency: orderData.currency,
          name: "CraveBite",
          description: `Order from ${restaurantName}`,
          order_id: orderData.razorpayOrderId,
          handler: async function (response: any) {
            try {
              setIsPlacingOrder(true);
              const verifyRes = await fetch("/api/payments/verify", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  razorpayOrderId: orderData.razorpayOrderId,
                  razorpayPaymentId: response.razorpay_payment_id,
                  razorpaySignature: response.razorpay_signature,
                }),
              });

              const verifyData = await verifyRes.json();
              if (verifyRes.ok && verifyData.success) {
                clearCart();
                router.push("/dashboard");
              } else {
                throw new Error(verifyData.error || "Payment signature verification failed");
              }
            } catch (err: any) {
              console.error(err);
              setErrorMessage(err.message || "Payment verification failed. Please contact support.");
              setIsPlacingOrder(false);
            }
          },
          prefill: {
            name: user.name,
            email: user.email,
            contact: phone,
          },
          theme: {
            color: "#ff6b35",
          },
          modal: {
            ondismiss: function() {
              setIsPlacingOrder(false);
            }
          }
        };

        const rzp = new (window as any).Razorpay(options);
        rzp.open();
      }

    } catch (err: any) {
      console.error("Order error:", err);
      setErrorMessage(err.message || "Failed to place order. Please try again.");
      setIsPlacingOrder(false);
    }
  };

  const handleSimulateSuccess = async () => {
    if (!paymentOrderDetails) return;
    
    setIsSimulating(true);
    setErrorMessage("");

    try {
      const res = await fetch("/api/payments/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          razorpayOrderId: paymentOrderDetails.razorpayOrderId,
          razorpayPaymentId: `pay_mock_${Date.now()}`,
          razorpaySignature: "mock_signature",
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        clearCart();
        setShowSandboxModal(false);
        router.push("/dashboard");
      } else {
        throw new Error(data.error || "Simulation verification failed");
      }
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || "Simulation failed. Please try again.");
    } finally {
      setIsSimulating(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="glass-card p-5 text-center flex-center flex-column" style={{ minHeight: "50vh" }}>
        <ShoppingCart size={48} className="text-muted mb-3" />
        <h3>Your Cart is Empty</h3>
        <p className="text-secondary mt-1">Add items from a restaurant before proceeding to checkout.</p>
        <button onClick={() => router.push("/restaurants")} className="btn btn-primary mt-4">
          Browse Restaurants
        </button>
      </div>
    );
  }

  return (
    <div className="checkout-layout-grid grid-2 mt-4" style={{ display: "grid", gap: "30px", gridTemplateColumns: "1.2fr 0.8fr" }}>
      {/* Left Column: Form & Address Details */}
      <form onSubmit={handlePlaceOrder} className="checkout-main-form flex-column gap-4">
        {/* Delivery Details Card */}
        <div className="glass-card p-4">
          <h2 className="mb-4" style={{ fontSize: "1.5rem", borderBottom: "1px solid var(--border-color)", paddingBottom: "12px" }}>
            Delivery Details
          </h2>

          <div className="flex-column gap-4">
            {/* Address */}
            <div className="auth-input-group flex-column" style={{ display: "flex", gap: "6px" }}>
              <label htmlFor="address" className="flex-start gap-1" style={{ fontWeight: 600, color: "var(--text-primary)" }}>
                <MapPin size={16} className="text-gradient" />
                <span>Delivery Address</span>
                {addressError && <span className="error-text" style={{ color: "var(--secondary)", fontSize: "12px", marginLeft: "10px" }}>{addressError}</span>}
              </label>
              <textarea
                id="address"
                className={`auth-input ${addressError ? "error" : ""}`}
                style={{ minHeight: "100px", padding: "12px", borderRadius: "8px", background: "var(--bg-tertiary)", border: "1px solid var(--border-color)", color: "var(--text-primary)", outline: "none" }}
                placeholder="Enter complete delivery address with door number, landmark, street etc."
                value={address}
                onChange={(e) => {
                  setAddress(e.target.value);
                  if (addressError) setAddressError("");
                }}
              />
            </div>

            {/* Phone */}
            <div className="auth-input-group flex-column" style={{ display: "flex", gap: "6px" }}>
              <label htmlFor="phone" className="flex-start gap-1" style={{ fontWeight: 600, color: "var(--text-primary)" }}>
                <Phone size={16} className="text-gradient" />
                <span>Contact Phone Number</span>
                {phoneError && <span className="error-text" style={{ color: "var(--secondary)", fontSize: "12px", marginLeft: "10px" }}>{phoneError}</span>}
              </label>
              <input
                id="phone"
                type="tel"
                className={`auth-input ${phoneError ? "error" : ""}`}
                style={{ padding: "12px", borderRadius: "8px", background: "var(--bg-tertiary)", border: "1px solid var(--border-color)", color: "var(--text-primary)", outline: "none" }}
                placeholder="e.g. +919876543210"
                value={phone}
                onChange={(e) => {
                  setPhone(e.target.value);
                  if (phoneError) setPhoneError("");
                }}
              />
            </div>
          </div>
        </div>

        {/* Security / Payment Disclaimer */}
        <div className="glass-card p-4 flex-start gap-3" style={{ borderLeft: "4px solid var(--primary)", display: "flex" }}>
          <ShieldCheck size={28} className="text-gradient" style={{ flexShrink: 0 }} />
          <div>
            <h3 style={{ fontSize: "14px", fontWeight: 700 }}>Safe Payments & Support</h3>
            <p className="text-secondary" style={{ fontSize: "13px", lineHeight: "1.4", marginTop: "4px" }}>
              Payments are simulated in test environments. In live deployments, your connection is encrypted with SSL and processed securely by Razorpay.
            </p>
          </div>
        </div>

        {errorMessage && (
          <div className="glass-card p-3 flex-start gap-2 text-danger" style={{ display: "flex", background: "rgba(255, 63, 63, 0.05)", border: "1px solid rgba(255, 63, 63, 0.15)" }}>
            <AlertCircle size={18} />
            <span style={{ fontSize: "14px", fontWeight: 600 }}>{errorMessage}</span>
          </div>
        )}
      </form>

      {/* Right Column: Cart items & Billing Summary */}
      <div className="checkout-sidebar flex-column gap-4" style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
        {/* Cart items list */}
        <div className="glass-card p-4">
          <h2 className="mb-3" style={{ fontSize: "1.25rem", borderBottom: "1px solid var(--border-color)", paddingBottom: "12px" }}>
            Order Items
          </h2>
          <p className="text-secondary mb-3" style={{ fontSize: "13px" }}>Ordering from: <strong className="text-primary">{restaurantName}</strong></p>
          
          <div className="flex-column gap-3" style={{ display: "flex", maxHeight: "240px", overflowY: "auto", paddingRight: "4px" }}>
            {items.map((item) => (
              <div key={item.id} className="flex-between py-2" style={{ display: "flex", borderBottom: "1px solid rgba(255,255,255,0.03)" }}>
                <div>
                  <h4 style={{ fontSize: "14px", fontWeight: 700 }}>{item.name}</h4>
                  <span className="text-muted" style={{ fontSize: "12px" }}>Quantity: {item.quantity}</span>
                </div>
                <span style={{ fontSize: "14px", fontWeight: 800 }}>₹{(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bill summary */}
        <div className="glass-card p-4">
          <h2 className="mb-4" style={{ fontSize: "1.25rem", borderBottom: "1px solid var(--border-color)", paddingBottom: "12px" }}>
            Bill Details
          </h2>

          <div className="flex-column gap-3" style={{ display: "flex", gap: "12px", borderBottom: "1px solid var(--border-color)", paddingBottom: "16px" }}>
            <div className="flex-between" style={{ display: "flex" }}>
              <span className="text-secondary" style={{ fontSize: "14.5px" }}>Cart Subtotal</span>
              <span style={{ fontSize: "14.5px", fontWeight: 600 }}>₹{subtotal.toFixed(2)}</span>
            </div>
            <div className="flex-between" style={{ display: "flex" }}>
              <span className="text-secondary" style={{ fontSize: "14.5px" }}>Delivery Partner Fee</span>
              <span style={{ fontSize: "14.5px", fontWeight: 600 }}>₹{deliveryFee.toFixed(2)}</span>
            </div>
            <div className="flex-between" style={{ display: "flex" }}>
              <span className="text-secondary" style={{ fontSize: "14.5px" }}>GST & Restaurant Charges (5%)</span>
              <span style={{ fontSize: "14.5px", fontWeight: 600 }}>₹{taxes.toFixed(2)}</span>
            </div>
          </div>

          <div className="flex-between mt-4 mb-4" style={{ display: "flex" }}>
            <strong style={{ fontSize: "18px", fontWeight: 800 }}>To Pay</strong>
            <strong className="text-gradient" style={{ fontSize: "22px", fontWeight: 800 }}>₹{total.toFixed(2)}</strong>
          </div>

          <button
            onClick={handlePlaceOrder}
            disabled={isPlacingOrder}
            className="btn btn-primary"
            style={{ width: "100%", padding: "14px", fontSize: "16px", borderRadius: "12px", display: "flex", justifyContent: "center" }}
          >
            {isPlacingOrder ? "Initializing order..." : `Place Order (₹${total.toFixed(2)})`}
          </button>
        </div>
      </div>

      {/* Sandbox Simulator checkout overlay modal */}
      {showSandboxModal && paymentOrderDetails && (
        <div className="modal-overlay flex-center">
          <div className="modal-content glass-card animate-float" style={{ maxWidth: "480px" }}>
            <div className="modal-header flex-between mb-3">
              <h3 className="modal-title flex-center gap-2" style={{ color: "var(--accent-yellow)", display: "flex" }}>
                <CreditCard size={20} />
                <span>Sandbox Payment Simulator</span>
              </h3>
              <button 
                onClick={() => {
                  setShowSandboxModal(false);
                  setIsPlacingOrder(false);
                }}
                className="modal-close-btn"
                disabled={isSimulating}
              >
                <X size={18} />
              </button>
            </div>
            
            <p className="modal-body-text" style={{ fontSize: "14px", lineHeight: "1.6" }}>
              Razorpay API keys were not found or set to default test values. Frontend is simulating the gateway inside this Sandbox Overlay.
            </p>

            <div className="glass-card p-3 my-3" style={{ background: "rgba(255,255,255,0.02)", display: "flex", flexDirection: "column", gap: "10px", textAlign: "left", fontSize: "13.5px" }}>
              <div><span className="text-muted">Vendor Restaurant:</span> <strong>{restaurantName}</strong></div>
              <div><span className="text-muted">Simulated Order ID:</span> <code style={{ background: "var(--bg-primary)", padding: "2px 6px", borderRadius: "4px" }}>{paymentOrderDetails.razorpayOrderId}</code></div>
              <div><span className="text-muted">Total Amount:</span> <strong className="text-gradient">₹{paymentOrderDetails.amount.toFixed(2)}</strong></div>
            </div>

            {errorMessage && (
              <div className="text-danger mb-3" style={{ fontSize: "13px", fontWeight: 600 }}>
                {errorMessage}
              </div>
            )}

            <div className="modal-footer flex-end gap-3 mt-4" style={{ display: "flex", justifyContent: "flex-end" }}>
              <button
                onClick={() => {
                  setShowSandboxModal(false);
                  setIsPlacingOrder(false);
                }}
                className="btn btn-secondary"
                disabled={isSimulating}
              >
                Cancel Payment
              </button>
              <button
                onClick={handleSimulateSuccess}
                className="btn btn-primary"
                disabled={isSimulating}
                style={{ background: "linear-gradient(135deg, var(--accent-green) 0%, #2dc653 100%)", display: "flex", gap: "6px", alignItems: "center" }}
              >
                {isSimulating ? (
                  "Processing..."
                ) : (
                  <>
                    <CheckCircle size={16} />
                    <span>Simulate Success</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

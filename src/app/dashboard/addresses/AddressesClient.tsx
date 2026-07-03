"use client";

import React, { useState } from "react";
import { MapPin, Phone, Save, CheckCircle2, AlertCircle } from "lucide-react";

interface AddressesClientProps {
  initialUser: {
    phone: string;
    defaultAddress: string;
  };
}

export default function AddressesClient({ initialUser }: AddressesClientProps) {
  const [address, setAddress] = useState(initialUser.defaultAddress || "");
  const [phone, setPhone] = useState(initialUser.phone || "");
  const [isSaving, setIsSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSuccess(false);
    setError("");

    try {
      const res = await fetch("/api/user/update-profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ defaultAddress: address, phone }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setSuccess(true);
      } else {
        throw new Error(data.error || "Failed to update profile");
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to save profile changes");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="addresses-container">
      <h2 className="dashboard-sec-title">
        <MapPin size={22} className="text-gradient" />
        <span>Manage Addresses & Contact</span>
      </h2>

      <div className="glass-card p-4 mt-3" style={{ maxWidth: "600px" }}>
        <p className="text-secondary mb-4" style={{ fontSize: "14px", lineHeight: "1.5" }}>
          Define your primary delivery parameters here. These fields will be pre-filled automatically on checkout.
        </p>

        <form onSubmit={handleSubmit} className="flex-column gap-4" style={{ display: "flex" }}>
          {/* Address Input */}
          <div className="auth-input-group flex-column" style={{ display: "flex", gap: "6px" }}>
            <label htmlFor="address" style={{ fontWeight: 600 }}>Default Delivery Address</label>
            <textarea
              id="address"
              style={{ 
                minHeight: "100px", 
                padding: "12px", 
                borderRadius: "8px", 
                background: "var(--bg-tertiary)", 
                border: "1px solid var(--border-color)", 
                color: "var(--text-primary)", 
                outline: "none",
                fontFamily: "inherit"
              }}
              placeholder="e.g. 123 Foodie Blvd, Taste Town, FC 45678"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>

          {/* Phone Input */}
          <div className="auth-input-group flex-column" style={{ display: "flex", gap: "6px" }}>
            <label htmlFor="phone" style={{ fontWeight: 600 }}>Contact Phone Number</label>
            <input
              id="phone"
              type="tel"
              style={{ 
                padding: "12px", 
                borderRadius: "8px", 
                background: "var(--bg-tertiary)", 
                border: "1px solid var(--border-color)", 
                color: "var(--text-primary)", 
                outline: "none" 
              }}
              placeholder="e.g. +919876543210"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>

          {success && (
            <div className="flex-start gap-2 text-success" style={{ display: "flex", alignItems: "center", color: "var(--accent-green)", fontSize: "14px", fontWeight: 600 }}>
              <CheckCircle2 size={16} />
              <span>Default address & profile coordinates saved successfully!</span>
            </div>
          )}

          {error && (
            <div className="flex-start gap-2 text-danger" style={{ display: "flex", alignItems: "center", color: "var(--secondary)", fontSize: "14px", fontWeight: 600 }}>
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={isSaving}
            className="btn btn-primary"
            style={{ padding: "12px", fontSize: "15px", display: "flex", justifyContent: "center", width: "100%", gap: "8px" }}
          >
            <Save size={16} />
            <span>{isSaving ? "Saving details..." : "Save Delivery Settings"}</span>
          </button>
        </form>
      </div>
    </div>
  );
}

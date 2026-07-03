import React from "react";
import "./auth.css";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="auth-container">
      <div className="auth-sidebar">
        <div className="auth-sidebar-content">
          <h1>Satisfy Your Cravings in Seconds</h1>
          <p>
            Join CraveBite to discover top local restaurants, build custom carts, and experience premium taste delivered right to your doorstep.
          </p>
        </div>
      </div>
      <div className="auth-form-container">
        {children}
      </div>
    </div>
  );
}

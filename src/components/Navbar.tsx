"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { useCart } from "@/context/CartContext";
import { Menu, X, ShoppingCart, User, LogOut, LayoutDashboard, Utensils } from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const { totalItems } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Do not render Navbar on auth pages
  const isAuthPage = pathname?.startsWith("/login") || pathname?.startsWith("/register");
  if (isAuthPage) return null;

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  const handleSignOut = () => {
    signOut({ callbackUrl: "/" });
    closeMobileMenu();
  };

  return (
    <header className="navbar-header">
      <div className="container navbar-container">
        {/* Brand Logo */}
        <Link href="/" className="navbar-logo" onClick={closeMobileMenu}>
          <div className="logo-icon">
            <Utensils size={22} className="logo-svg" />
          </div>
          <span>Crave<span className="text-gradient">Bite</span></span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="navbar-desktop-nav">
          <Link href="/" className={`nav-link ${pathname === "/" ? "active" : ""}`}>
            Home
          </Link>
          <Link href="/restaurants" className={`nav-link ${pathname?.startsWith("/restaurants") ? "active" : ""}`}>
            Restaurants
          </Link>
          
          <div className="nav-actions">
            {/* Cart Icon Link */}
            <Link href="/checkout" className="nav-cart-btn" aria-label="View Cart">
              <ShoppingCart size={20} />
              {totalItems > 0 && (
                <span className="cart-badge animate-pulse">{totalItems}</span>
              )}
            </Link>

            {status === "authenticated" ? (
              <div className="user-profile-group">
                <Link href="/dashboard" className="btn btn-secondary dashboard-link">
                  <LayoutDashboard size={16} />
                  <span>Dashboard</span>
                </Link>
                <button onClick={handleSignOut} className="btn btn-logout-icon" title="Sign Out">
                  <LogOut size={16} />
                </button>
              </div>
            ) : (
              <Link href="/login" className="btn btn-primary nav-login-btn">
                <User size={16} />
                <span>Login</span>
              </Link>
            )}
          </div>
        </nav>

        {/* Mobile Hamburger Trigger */}
        <div className="navbar-mobile-actions">
          <Link href="/checkout" className="nav-cart-btn mobile-cart-btn" aria-label="View Cart">
            <ShoppingCart size={20} />
            {totalItems > 0 && (
              <span className="cart-badge animate-pulse">{totalItems}</span>
            )}
          </Link>
          
          <button 
            className="mobile-menu-toggle" 
            onClick={toggleMobileMenu}
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="navbar-mobile-drawer glass-card">
          <nav className="mobile-nav-links">
            <Link href="/" className={`mobile-nav-link ${pathname === "/" ? "active" : ""}`} onClick={closeMobileMenu}>
              Home
            </Link>
            <Link href="/restaurants" className={`mobile-nav-link ${pathname?.startsWith("/restaurants") ? "active" : ""}`} onClick={closeMobileMenu}>
              Restaurants
            </Link>
            
            <div className="mobile-nav-divider"></div>

            {status === "authenticated" ? (
              <>
                <div className="mobile-user-info">
                  <User size={18} className="text-gradient" />
                  <span>Signed in as <strong className="user-name-text">{session.user?.name || "User"}</strong></span>
                </div>
                <Link href="/dashboard" className="btn btn-secondary mobile-menu-btn" onClick={closeMobileMenu}>
                  <LayoutDashboard size={18} />
                  <span>Dashboard</span>
                </Link>
                <button onClick={handleSignOut} className="btn btn-primary mobile-menu-btn signout-btn">
                  <LogOut size={18} />
                  <span>Sign Out</span>
                </button>
              </>
            ) : (
              <Link href="/login" className="btn btn-primary mobile-menu-btn" onClick={closeMobileMenu}>
                <User size={18} />
                <span>Login / Register</span>
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}

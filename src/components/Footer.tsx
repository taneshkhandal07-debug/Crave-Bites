"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Facebook, 
  Twitter, 
  Instagram, 
  Github, 
  Mail, 
  Phone, 
  MapPin, 
  Utensils 
} from "lucide-react";

export default function Footer() {
  const pathname = usePathname();

  // Hide footer on auth pages
  const isAuthPage = pathname?.startsWith("/login") || pathname?.startsWith("/register");
  if (isAuthPage) return null;

  return (
    <footer className="footer-container">
      <div className="container footer-content-grid">
        {/* Info Column */}
        <div className="footer-col brand-col">
          <Link href="/" className="navbar-logo footer-logo">
            <div className="logo-icon">
              <Utensils size={20} className="logo-svg" />
            </div>
            <span>Crave<span className="text-gradient">Bite</span></span>
          </Link>
          <p className="footer-description">
            Bringing your favorite meals from top-rated local restaurants straight to your doorstep. Satisfy your cravings in minutes.
          </p>
          <div className="social-links">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="social-icon" aria-label="Facebook">
              <Facebook size={18} />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="social-icon" aria-label="Twitter">
              <Twitter size={18} />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="social-icon" aria-label="Instagram">
              <Instagram size={18} />
            </a>
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="social-icon" aria-label="GitHub">
              <Github size={18} />
            </a>
          </div>
        </div>

        {/* Quick Links Column */}
        <div className="footer-col">
          <h3>Quick Links</h3>
          <ul className="footer-links">
            <li>
              <Link href="/">Home</Link>
            </li>
            <li>
              <Link href="/restaurants">Browse Restaurants</Link>
            </li>
            <li>
              <Link href="/checkout">View Checkout</Link>
            </li>
            <li>
              <Link href="/dashboard">User Dashboard</Link>
            </li>
          </ul>
        </div>

        {/* Cuisines Column */}
        <div className="footer-col">
          <h3>Popular Cuisines</h3>
          <ul className="footer-links">
            <li>
              <Link href="/restaurants?cuisine=Pizza">Cheesy Pizza</Link>
            </li>
            <li>
              <Link href="/restaurants?cuisine=Burgers">Juicy Burgers</Link>
            </li>
            <li>
              <Link href="/restaurants?cuisine=Sushi">Fresh Sushi</Link>
            </li>
            <li>
              <Link href="/restaurants?cuisine=Healthy">Healthy Bowls</Link>
            </li>
          </ul>
        </div>

        {/* Contact Column */}
        <div className="footer-col contact-col">
          <h3>Contact Us</h3>
          <ul className="contact-list">
            <li>
              <MapPin size={16} />
              <span>123 Foodie Blvd, Taste Town, FC 45678</span>
            </li>
            <li>
              <Phone size={16} />
              <span>+1 (555) 987-6543</span>
            </li>
            <li>
              <Mail size={16} />
              <span>support@cravebite.com</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="container footer-bottom-inner flex-between">
          <p>&copy; {new Date().getFullYear()} CraveBite. All rights reserved.</p>
          <div className="footer-bottom-links">
            <Link href="/privacy">Privacy Policy</Link>
            <span className="divider-dot"></span>
            <Link href="/terms">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

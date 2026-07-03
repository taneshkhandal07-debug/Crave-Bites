"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search, MapPin, ArrowRight } from "lucide-react";

export default function HeroSection() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/restaurants?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      router.push("/restaurants");
    }
  };

  // Static properties for floating particles to keep it clean, but only render post-mount.
  const floatingFoods = [
    { emoji: "🍕", delay: "0s", duration: "12s", top: "12%", left: "8%", size: "2.5rem" },
    { emoji: "🍔", delay: "2s", duration: "14s", top: "68%", left: "6%", size: "2.8rem" },
    { emoji: "🍣", delay: "1s", duration: "16s", top: "18%", left: "82%", size: "2.6rem" },
    { emoji: "🥗", delay: "3s", duration: "13s", top: "62%", left: "88%", size: "2.2rem" },
    { emoji: "🍩", delay: "4s", duration: "15s", top: "45%", left: "12%", size: "2.0rem" },
    { emoji: "🌮", delay: "1.5s", duration: "11s", top: "48%", left: "86%", size: "2.4rem" },
  ];

  return (
    <section className="hero-section">
      {/* Hydration-guard floating elements */}
      {isMounted && (
        <div className="hero-floating-elements">
          {floatingFoods.map((item, idx) => (
            <div
              key={idx}
              className="floating-emoji"
              style={{
                top: item.top,
                left: item.left,
                fontSize: item.size,
                animationDelay: item.delay,
                animationDuration: item.duration,
              }}
            >
              {item.emoji}
            </div>
          ))}
        </div>
      )}

      <div className="container hero-content-wrapper">
        <div className="hero-content">
          <div className="hero-badge animate-float">
            <span>🔥 Fast & Free Delivery on first order!</span>
          </div>

          <h1 className="hero-title">
            Cravings <br />
            <span className="text-gradient">Delivered Fast!</span>
          </h1>

          <p className="hero-tagline">
            Satisfy your hunger with top local restaurants. Fresh ingredients, 
            lightning-fast delivery, and premium taste, straight to your doorstep.
          </p>

          <form onSubmit={handleSearch} className="hero-search-form glass-card">
            <div className="search-input-wrapper">
              <Search className="search-icon" size={20} />
              <input
                type="text"
                placeholder="Search cuisines, dishes or restaurants..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
            </div>
            <button type="submit" className="btn btn-primary search-submit-btn">
              <span>Find Food</span>
              <ArrowRight size={16} />
            </button>
          </form>

          <div className="hero-ctas">
            <button 
              onClick={() => router.push("/restaurants")} 
              className="btn btn-primary btn-lg"
            >
              <span>Order Now</span>
              <ArrowRight size={18} />
            </button>
            <a href="#cuisine-carousel" className="btn btn-secondary btn-lg">
              <span>Explore Cuisines</span>
            </a>
          </div>

          <div className="hero-stats">
            <div className="stat-item">
              <h3>8+</h3>
              <p>Top Cuisines</p>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-item">
              <h3>30+</h3>
              <p>Partner Restaurants</p>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-item">
              <h3>20 Min</h3>
              <p>Average Delivery</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

import React from "react";
import Link from "next/link";
import { db } from "@/lib/db";
import HeroSection from "@/components/HeroSection";
import CuisineCarousel from "@/components/CuisineCarousel";
import { Star, Clock, Sparkles, ArrowRight } from "lucide-react";

export const revalidate = 3600; // Cache page for 1 hour

async function getTopRestaurants() {
  try {
    const restaurants = await db.restaurant.findMany({
      orderBy: {
        rating: "desc",
      },
      take: 6,
    });
    return restaurants;
  } catch (error) {
    console.error("Error fetching top restaurants:", error);
    return [];
  }
}

export default async function Home() {
  const restaurants = await getTopRestaurants();

  return (
    <main className="homepage-container">
      {/* 1. Hero Section */}
      <HeroSection />

      {/* 2. Cuisine Carousel */}
      <CuisineCarousel />

      {/* 3. Popular Restaurants Section */}
      <section className="popular-restaurants container">
        <div className="section-header flex-between">
          <div>
            <h2 className="section-title flex-center gap-2">
              Popular Restaurants near you <Sparkles size={20} className="text-gradient animate-float" />
            </h2>
            <p className="section-subtitle">Specially curated top-rated spots for your gourmet taste buds</p>
          </div>
          <Link href="/restaurants" className="btn btn-secondary view-all-btn">
            <span>View All</span>
            <ArrowRight size={16} />
          </Link>
        </div>

        {restaurants.length === 0 ? (
          <div className="empty-state glass-card flex-center flex-column">
            <span style={{ fontSize: "3rem" }}>🍽️</span>
            <h3>No restaurants found</h3>
            <p>Please run the database seed script to populate restaurants.</p>
            <Link href="/restaurants" className="btn btn-primary mt-4">
              Browse Catalogue
            </Link>
          </div>
        ) : (
          <div className="grid-3 restaurants-grid">
            {restaurants.map((restaurant) => (
              <Link
                key={restaurant.id}
                href={`/restaurants/${restaurant.slug}`}
                className="restaurant-card-link"
              >
                <article className="card-gradient restaurant-card">
                  {/* Card Cover Image */}
                  <div className="restaurant-image-container">
                    <img
                      src={restaurant.coverImage || "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=500&auto=format&fit=crop&q=60"}
                      alt={restaurant.name}
                      className="restaurant-image"
                      loading="lazy"
                    />
                    
                    {/* Floating badges on image */}
                    {restaurant.isPremium && (
                      <span className="badge badge-popular premium-floating-badge">
                        Premium
                      </span>
                    )}
                    
                    <div className="card-image-overlay">
                      <span className="btn btn-primary quick-view-btn">
                        Order Now
                      </span>
                    </div>
                  </div>

                  {/* Card Info */}
                  <div className="restaurant-card-details">
                    <div className="flex-between mb-2">
                      <span className="restaurant-cuisine-tag">{restaurant.cuisine}</span>
                      <div className="restaurant-rating-badge flex-center">
                        <Star size={14} className="star-icon" fill="var(--accent-yellow)" />
                        <span>{restaurant.rating.toFixed(1)}</span>
                      </div>
                    </div>

                    <h3 className="restaurant-name">{restaurant.name}</h3>
                    
                    <div className="restaurant-meta flex-between mt-3">
                      <div className="meta-item flex-center gap-1">
                        <Clock size={14} className="text-muted" />
                        <span>{restaurant.deliveryTime} mins</span>
                      </div>
                      <span className="restaurant-address">{restaurant.address.split(",")[0]}</span>
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* 4. Features Section */}
      <section className="features-section container">
        <div className="grid-3 features-grid">
          <div className="feature-card glass-card">
            <div className="feature-icon">🚀</div>
            <h3>Superfast Delivery</h3>
            <p>Get food delivered hot and fresh in under 30 minutes from your local favorites.</p>
          </div>
          <div className="feature-card glass-card">
            <div className="feature-icon">🛡️</div>
            <h3>Safe & Secure Checkout</h3>
            <p>Multiple options including Credit cards, UPI, and instant refund options.</p>
          </div>
          <div className="feature-card glass-card">
            <div className="feature-icon">✨</div>
            <h3>Premium Selection</h3>
            <p>Handpicked collection of top-rated hygiene certified kitchens near you.</p>
          </div>
        </div>
      </section>
    </main>
  );
}

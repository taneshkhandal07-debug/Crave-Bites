"use client";

import React, { useState } from "react";
import { useCart } from "@/context/CartContext";
import { Star, Clock, MapPin, Sparkles, Plus, Check, ShoppingBag, X } from "lucide-react";

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  isVeg: boolean;
  imageUrl: string;
  available: boolean;
}

interface Review {
  id: string;
  rating: number;
  comment: string;
  createdAt: Date | string;
  user: {
    name: string | null;
  };
}

interface Restaurant {
  id: string;
  name: string;
  slug: string;
  address: string;
  rating: number;
  cuisine: string;
  coverImage: string;
  deliveryTime: number;
  isPremium: boolean;
  menuItems: MenuItem[];
  reviews: Review[];
}

interface RestaurantDetailClientProps {
  restaurant: Restaurant;
}

export default function RestaurantDetailClient({ restaurant }: RestaurantDetailClientProps) {
  const { addToCart, clearCart, restaurantName: cartRestaurantName, items: cartItems } = useCart();

  // Selected Category tab
  const [activeCategory, setActiveCategory] = useState<string>("All");

  // Conflict Modal State
  const [showConflictModal, setShowConflictModal] = useState(false);
  const [pendingItem, setPendingItem] = useState<MenuItem | null>(null);

  // Group menu items by category
  const categories = ["All", ...Array.from(new Set(restaurant.menuItems.map((item) => item.category)))];

  const filteredMenuItems = restaurant.menuItems.filter(
    (item) => activeCategory === "All" || item.category === activeCategory
  );

  const handleAddToCartClick = (item: MenuItem) => {
    const success = addToCart(
      {
        id: item.id,
        name: item.name,
        price: item.price,
        imageUrl: item.imageUrl,
        restaurantId: restaurant.id,
      },
      { id: restaurant.id, name: restaurant.name }
    );

    if (!success) {
      // Conflict detected! Store the item and show warning modal
      setPendingItem(item);
      setShowConflictModal(true);
    }
  };

  const handleClearAndAdd = () => {
    if (pendingItem) {
      clearCart();
      addToCart(
        {
          id: pendingItem.id,
          name: pendingItem.name,
          price: pendingItem.price,
          imageUrl: pendingItem.imageUrl,
          restaurantId: restaurant.id,
        },
        { id: restaurant.id, name: restaurant.name }
      );
    }
    setShowConflictModal(false);
    setPendingItem(null);
  };

  return (
    <div className="detail-page-container">
      {/* 1. Header Banner */}
      <div 
        className="restaurant-detail-banner"
        style={{ backgroundImage: `url(${restaurant.coverImage || "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1000&auto=format&fit=crop&q=80"})` }}
      >
        <div className="banner-overlay">
          <div className="container banner-content">
            <div className="banner-breadcrumbs text-muted">
              <a href="/">Home</a> &gt; <a href="/restaurants">Restaurants</a> &gt; <span>{restaurant.name}</span>
            </div>

            <div className="flex-start gap-3 mt-4">
              <span className="restaurant-cuisine-tag-lg badge">{restaurant.cuisine}</span>
              {restaurant.isPremium && (
                <span className="badge badge-popular flex-center gap-1">
                  <Sparkles size={12} />
                  <span>Premium Restaurant</span>
                </span>
              )}
            </div>

            <h1 className="restaurant-detail-name">{restaurant.name}</h1>
            
            <div className="restaurant-detail-meta flex-start gap-4">
              <div className="meta-info-item flex-center gap-1">
                <Star size={16} fill="var(--accent-yellow)" className="star-icon" />
                <span><strong>{restaurant.rating.toFixed(1)}</strong> ({restaurant.reviews.length} reviews)</span>
              </div>
              <div className="meta-info-item flex-center gap-1">
                <Clock size={16} />
                <span>Delivery: <strong>{restaurant.deliveryTime} mins</strong></span>
              </div>
              <div className="meta-info-item flex-center gap-1">
                <MapPin size={16} />
                <span>{restaurant.address}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Page Content Grid */}
      <div className="container menu-grid-layout mt-5">
        {/* Left Side: Category Navigator */}
        <aside className="menu-sidebar">
          <div className="sidebar-nav-card glass-card">
            <h3>Menu Categories</h3>
            <div className="category-list-nav">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`category-nav-btn ${activeCategory === cat ? "active" : ""}`}
                >
                  <span>{cat}</span>
                  <span className="cat-count">
                    {cat === "All"
                      ? restaurant.menuItems.length
                      : restaurant.menuItems.filter((i) => i.category === cat).length}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Right Side: Menu Items Listing */}
        <section className="menu-items-section">
          <h2 className="category-title-header">{activeCategory} Menu Items</h2>
          
          <div className="menu-items-grid">
            {filteredMenuItems.map((item) => (
              <div key={item.id} className="menu-item-card glass-card flex-between">
                <div className="menu-item-info">
                  <div className="flex-start gap-2 mb-2">
                    {item.isVeg ? (
                      <span className="badge badge-veg-icon" title="Vegetarian">
                        <span className="veg-dot"></span>
                      </span>
                    ) : (
                      <span className="badge badge-nonveg-icon" title="Non-Vegetarian">
                        <span className="nonveg-dot"></span>
                      </span>
                    )}
                    <span className="menu-item-cat">{item.category}</span>
                  </div>

                  <h3 className="menu-item-name">{item.name}</h3>
                  <p className="menu-item-description">{item.description}</p>
                  <span className="menu-item-price">₹{item.price.toFixed(2)}</span>
                </div>

                <div className="menu-item-image-action">
                  <div className="menu-item-image-wrapper">
                    <img
                      src={item.imageUrl || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=200&auto=format&fit=crop&q=60"}
                      alt={item.name}
                      className="menu-item-img"
                      loading="lazy"
                    />
                  </div>
                  
                  {item.available ? (
                    <button
                      onClick={() => handleAddToCartClick(item)}
                      className={`btn btn-add-item ${
                        cartItems.some((ci) => ci.id === item.id) ? "added" : ""
                      }`}
                    >
                      {cartItems.some((ci) => ci.id === item.id) ? (
                        <>
                          <Check size={14} />
                          <span>Added</span>
                        </>
                      ) : (
                        <>
                          <Plus size={14} />
                          <span>Add to Cart</span>
                        </>
                      )}
                    </button>
                  ) : (
                    <span className="badge badge-unavailable mt-2">Sold Out</span>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* 3. Reviews Sub-section */}
          <div className="restaurant-reviews-block mt-5">
            <h2 className="category-title-header">Customer Reviews</h2>
            {restaurant.reviews.length === 0 ? (
              <div className="glass-card p-4 text-center text-secondary">
                No reviews yet. Be the first to order and review this restaurant!
              </div>
            ) : (
              <div className="reviews-list">
                {restaurant.reviews.map((review) => (
                  <div key={review.id} className="review-card glass-card">
                    <div className="flex-between mb-2">
                      <strong>{review.user.name || "Anonymous Customer"}</strong>
                      <div className="flex-center gap-1 text-yellow">
                        {Array.from({ length: review.rating }).map((_, i) => (
                          <Star key={i} size={14} fill="var(--accent-yellow)" className="star-icon" />
                        ))}
                        {Array.from({ length: 5 - review.rating }).map((_, i) => (
                          <Star key={i} size={14} className="text-muted" />
                        ))}
                      </div>
                    </div>
                    <p className="review-text">{review.comment}</p>
                    <span className="review-date text-muted mt-2 block">
                      {new Date(review.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </div>

      {/* Cross-restaurant Conflict Warning Modal */}
      {showConflictModal && (
        <div className="modal-overlay flex-center">
          <div className="modal-content glass-card animate-float">
            <div className="modal-header flex-between mb-3">
              <h3 className="modal-title flex-center gap-2 text-danger">
                <ShoppingBag size={20} />
                <span>Replace Cart Items?</span>
              </h3>
              <button 
                onClick={() => {
                  setShowConflictModal(false);
                  setPendingItem(null);
                }}
                className="modal-close-btn"
              >
                <X size={18} />
              </button>
            </div>
            
            <p className="modal-body-text">
              Your cart currently contains items from <strong>{cartRestaurantName}</strong>. 
              You can only order from one restaurant at a time.
            </p>
            <p className="modal-body-subtext">
              Would you like to empty your cart and start a new order with items from <strong>{restaurant.name}</strong>?
            </p>

            <div className="modal-footer flex-end gap-3 mt-4">
              <button
                onClick={() => {
                  setShowConflictModal(false);
                  setPendingItem(null);
                }}
                className="btn btn-secondary"
              >
                Cancel
              </button>
              <button
                onClick={handleClearAndAdd}
                className="btn btn-primary"
                style={{ background: "linear-gradient(135deg, var(--secondary) 0%, var(--primary) 100%)" }}
              >
                Clear Cart & Add
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

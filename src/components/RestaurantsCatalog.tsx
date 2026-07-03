"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { Search, Star, Clock, Filter, SlidersHorizontal, Sparkles } from "lucide-react";

interface MenuItem {
  id: string;
  isVeg: boolean;
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
}

interface RestaurantsCatalogProps {
  initialRestaurants: Restaurant[];
}

const CUISINES = ["All", "Italian", "Indian", "Chinese", "Fast Food", "Healthy", "Japanese", "Pizza", "Sushi", "Burgers"];

export default function RestaurantsCatalog({ initialRestaurants }: RestaurantsCatalogProps) {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Read initial params
  const paramSearch = searchParams.get("search") || "";
  const paramCuisine = searchParams.get("cuisine") || "All";

  const [searchQuery, setSearchQuery] = useState(paramSearch);
  const [selectedCuisine, setSelectedCuisine] = useState(paramCuisine);
  const [vegOnly, setVegOnly] = useState(false);
  const [sortBy, setSortBy] = useState<"rating" | "deliveryTime">("rating");

  // Sync state if query params change
  useEffect(() => {
    setSearchQuery(paramSearch);
    setSelectedCuisine(paramCuisine);
  }, [paramSearch, paramCuisine]);

  // Update URL search parameters when filters change
  const updateUrl = (search: string, cuisine: string) => {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (cuisine && cuisine !== "All") params.set("cuisine", cuisine);
    router.replace(`/restaurants?${params.toString()}`, { scroll: false });
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    updateUrl(value, selectedCuisine);
  };

  const handleCuisineSelect = (cuisine: string) => {
    setSelectedCuisine(cuisine);
    updateUrl(searchQuery, cuisine);
  };

  // Filtered & Sorted Restaurants
  const filteredRestaurants = useMemo(() => {
    let result = [...initialRestaurants];

    // 1. Search Query Filter (matches name, address, or cuisine)
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      result = result.filter(
        (r) =>
          r.name.toLowerCase().includes(query) ||
          r.cuisine.toLowerCase().includes(query) ||
          r.address.toLowerCase().includes(query)
      );
    }

    // 2. Cuisine Filter
    if (selectedCuisine && selectedCuisine !== "All") {
      result = result.filter(
        (r) => r.cuisine.toLowerCase() === selectedCuisine.toLowerCase()
      );
    }

    // 3. Veg Only Filter (checks if any menu item is veg)
    if (vegOnly) {
      result = result.filter((r) => r.menuItems.some((item) => item.isVeg));
    }

    // 4. Sorting
    result.sort((a, b) => {
      if (sortBy === "rating") {
        return b.rating - a.rating; // Highest rating first
      } else {
        return a.deliveryTime - b.deliveryTime; // Fastest delivery first
      }
    });

    return result;
  }, [initialRestaurants, searchQuery, selectedCuisine, vegOnly, sortBy]);

  return (
    <div className="catalog-container">
      {/* Search and Filters Header */}
      <div className="catalog-filter-bar glass-card">
        <div className="filter-row-top">
          <div className="search-bar-wrapper">
            <Search className="search-icon" size={18} />
            <input
              type="text"
              placeholder="Search by restaurant name or cuisine..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="catalog-search-input"
            />
          </div>

          <div className="sort-controls flex-center gap-2">
            <SlidersHorizontal size={16} className="text-muted" />
            <span className="sort-label">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="sort-select"
            >
              <option value="rating">Highest Rated</option>
              <option value="deliveryTime">Fastest Delivery</option>
            </select>
          </div>
        </div>

        <div className="filter-row-bottom flex-between mt-4">
          {/* Cuisines Pills */}
          <div className="cuisine-pills-container">
            {CUISINES.map((cuisine) => (
              <button
                key={cuisine}
                onClick={() => handleCuisineSelect(cuisine)}
                className={`cuisine-pill-btn ${
                  selectedCuisine.toLowerCase() === cuisine.toLowerCase() ? "active" : ""
                }`}
              >
                {cuisine}
              </button>
            ))}
          </div>

          {/* Veg Only Switch */}
          <button
            onClick={() => setVegOnly(!vegOnly)}
            className={`veg-toggle-btn ${vegOnly ? "active" : ""}`}
          >
            <span className="veg-indicator-dot"></span>
            <span>Veg Only</span>
          </button>
        </div>
      </div>

      {/* Results Display */}
      <div className="catalog-results-header flex-between mb-4">
        <h2>
          {filteredRestaurants.length}{" "}
          {filteredRestaurants.length === 1 ? "Restaurant" : "Restaurants"} Available
        </h2>
        {selectedCuisine !== "All" && (
          <span className="active-filter-badge badge">
            Cuisine: {selectedCuisine}
          </span>
        )}
      </div>

      {/* Grid of Restaurants */}
      {filteredRestaurants.length === 0 ? (
        <div className="empty-state glass-card flex-center flex-column py-5">
          <span style={{ fontSize: "3.5rem" }}>🔍</span>
          <h3 className="mt-3">No restaurants match your filters</h3>
          <p className="text-secondary mt-1">Try clearing your search query or selecting another cuisine tag.</p>
          <button
            onClick={() => {
              setSearchQuery("");
              setSelectedCuisine("All");
              setVegOnly(false);
              updateUrl("", "All");
            }}
            className="btn btn-primary mt-4"
          >
            Clear All Filters
          </button>
        </div>
      ) : (
        <div className="grid-3 restaurants-grid">
          {filteredRestaurants.map((restaurant) => (
            <Link
              key={restaurant.id}
              href={`/restaurants/${restaurant.slug}`}
              className="restaurant-card-link"
            >
              <article className="card-gradient restaurant-card">
                {/* Cover Image */}
                <div className="restaurant-image-container">
                  <img
                    src={restaurant.coverImage || "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=500&auto=format&fit=crop&q=60"}
                    alt={restaurant.name}
                    className="restaurant-image"
                    loading="lazy"
                  />
                  {restaurant.isPremium && (
                    <span className="badge badge-popular premium-floating-badge">
                      Premium
                    </span>
                  )}
                  <div className="card-image-overlay">
                    <span className="btn btn-primary quick-view-btn">View Menu</span>
                  </div>
                </div>

                {/* Details */}
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
    </div>
  );
}

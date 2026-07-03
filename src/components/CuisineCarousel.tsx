"use client";

import React, { useRef } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Cuisine {
  name: string;
  emoji: string;
  gradient: string;
  description: string;
}

const cuisines: Cuisine[] = [
  {
    name: "Pizza",
    emoji: "🍕",
    gradient: "linear-gradient(135deg, #ff9f1c 0%, #ff4040 100%)",
    description: "Cheesy goodness",
  },
  {
    name: "Sushi",
    emoji: "🍣",
    gradient: "linear-gradient(135deg, #ff5e62 0%, #ff9966 100%)",
    description: "Fresh Japanese",
  },
  {
    name: "Burgers",
    emoji: "🍔",
    gradient: "linear-gradient(135deg, #f5af19 0%, #e15f41 100%)",
    description: "Juicy patties",
  },
  {
    name: "Healthy",
    emoji: "🥗",
    gradient: "linear-gradient(135deg, #11998e 0%, #38ef7d 100%)",
    description: "Fresh & Green",
  },
  {
    name: "Desserts",
    emoji: "🍩",
    gradient: "linear-gradient(135deg, #ea8df7 0%, #9b51e0 100%)",
    description: "Sweet treats",
  },
  {
    name: "Indian",
    emoji: "🍛",
    gradient: "linear-gradient(135deg, #f857a6 0%, #ff5858 100%)",
    description: "Rich spices",
  },
  {
    name: "Chinese",
    emoji: "🍜",
    gradient: "linear-gradient(135deg, #e65c00 0%, #f9d423 100%)",
    description: "Delicious noodles",
  },
];

export default function CuisineCarousel() {
  const carouselRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (carouselRef.current) {
      const { scrollLeft, clientWidth } = carouselRef.current;
      const scrollAmount = clientWidth * 0.75;
      carouselRef.current.scrollTo({
        left: direction === "left" ? scrollLeft - scrollAmount : scrollLeft + scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <section id="cuisine-carousel" className="cuisine-section container">
      <div className="section-header flex-between">
        <div>
          <h2 className="section-title">In the Mood for Something Specific?</h2>
          <p className="section-subtitle">Browse food categories and discover local delicacies</p>
        </div>
        <div className="carousel-controls">
          <button 
            onClick={() => scroll("left")} 
            className="carousel-arrow" 
            aria-label="Scroll left"
          >
            <ChevronLeft size={20} />
          </button>
          <button 
            onClick={() => scroll("right")} 
            className="carousel-arrow" 
            aria-label="Scroll right"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      <div className="cuisine-carousel-container" ref={carouselRef}>
        {cuisines.map((cuisine) => (
          <Link
            key={cuisine.name}
            href={`/restaurants?cuisine=${encodeURIComponent(cuisine.name)}`}
            className="cuisine-card-wrapper"
          >
            <div 
              className="cuisine-card" 
              style={{ background: cuisine.gradient }}
            >
              <span className="cuisine-emoji animate-float">{cuisine.emoji}</span>
              <div className="cuisine-info">
                <h3>{cuisine.name}</h3>
                <p>{cuisine.description}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

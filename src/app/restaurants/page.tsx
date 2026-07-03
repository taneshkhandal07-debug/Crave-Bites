import React, { Suspense } from "react";
import { db } from "@/lib/db";
import RestaurantsCatalog from "@/components/RestaurantsCatalog";

export const dynamic = "force-dynamic";

async function getAllRestaurants() {
  try {
    const restaurants = await db.restaurant.findMany({
      include: {
        menuItems: {
          select: {
            id: true,
            isVeg: true,
          },
        },
      },
      orderBy: {
        name: "asc",
      },
    });
    return restaurants;
  } catch (error) {
    console.error("Error fetching all restaurants:", error);
    return [];
  }
}

export default async function RestaurantsPage() {
  const restaurants = await getAllRestaurants();

  return (
    <main className="restaurants-page-wrapper container" style={{ padding: "120px 24px 80px 24px" }}>
      <div className="catalog-header mb-4">
        <h1 className="catalog-title">Explore Restaurants</h1>
        <p className="catalog-subtitle text-secondary">
          Discover a world of cuisines, fresh dishes, and top-tier culinary choices nearby.
        </p>
      </div>

      <Suspense
        fallback={
          <div className="flex-center py-5 flex-column gap-2">
            <div className="loading-spinner"></div>
            <p className="text-secondary">Loading restaurants...</p>
          </div>
        }
      >
        <RestaurantsCatalog initialRestaurants={restaurants} />
      </Suspense>
    </main>
  );
}

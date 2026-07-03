import React from "react";
import Link from "next/link";
import { db } from "@/lib/db";
import RestaurantDetailClient from "@/components/RestaurantDetailClient";

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

async function getRestaurantBySlug(slug: string) {
  try {
    const restaurant = await db.restaurant.findUnique({
      where: {
        slug: slug,
      },
      include: {
        menuItems: {
          orderBy: {
            name: "asc",
          },
        },
        reviews: {
          include: {
            user: {
              select: {
                name: true,
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });
    return restaurant;
  } catch (error) {
    console.error("Error fetching restaurant by slug:", error);
    return null;
  }
}

export default async function RestaurantDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const restaurant = await getRestaurantBySlug(slug);

  if (!restaurant) {
    return (
      <main className="container flex-center flex-column" style={{ minHeight: "80vh", padding: "120px 24px" }}>
        <span style={{ fontSize: "4rem" }}>🥡</span>
        <h1 className="mt-4">Restaurant Not Found</h1>
        <p className="text-secondary mt-1">
          The restaurant you are looking for does not exist or has been removed.
        </p>
        <Link href="/restaurants" className="btn btn-primary mt-4">
          Back to Restaurants
        </Link>
      </main>
    );
  }

  return (
    <main className="restaurant-details-page-wrapper">
      <RestaurantDetailClient restaurant={restaurant as any} />
    </main>
  );
}

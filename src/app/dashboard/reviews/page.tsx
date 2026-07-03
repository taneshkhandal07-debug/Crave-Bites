import React from "react";
import Link from "next/link";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { MessageSquare, Star, Calendar, Utensils } from "lucide-react";

export const metadata = {
  title: "Your Reviews | CraveBite",
  description: "View and manage reviews you've written for restaurants.",
};

async function getUserReviews(userId: string) {
  try {
    const reviews = await db.review.findMany({
      where: {
        userId: userId,
      },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        restaurant: {
          select: {
            name: true,
          },
        },
      },
    });
    return reviews;
  } catch (error) {
    console.error("Error fetching user reviews:", error);
    return [];
  }
}

export default async function ReviewsPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    redirect("/login?callbackUrl=/dashboard/reviews");
  }

  const user = await db.user.findUnique({
    where: { email: session.user.email },
    select: { id: true },
  });

  if (!user) {
    redirect("/login?callbackUrl=/dashboard/reviews");
  }

  const reviews = await getUserReviews(user.id);

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="reviews-page-wrapper">
      <h2 className="dashboard-sec-title">
        <MessageSquare size={22} className="text-gradient" />
        <span>Your Reviews</span>
      </h2>

      {reviews.length === 0 ? (
        <div className="glass-card p-5 text-center flex-center flex-column">
          <span style={{ fontSize: "3rem" }}>✍️</span>
          <h3 className="mt-3">No reviews submitted yet</h3>
          <p className="text-secondary mt-1">
            Order food from restaurants first to review your experience.
          </p>
          <Link href="/dashboard/orders" className="btn btn-secondary mt-4">
            View Order History
          </Link>
        </div>
      ) : (
        <div className="orders-list-wrapper">
          {reviews.map((review) => (
            <div key={review.id} className="glass-card p-4 flex-column gap-2" style={{ display: "flex", gap: "10px" }}>
              <div className="flex-between" style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
                <div className="flex-start gap-2" style={{ display: "flex", alignItems: "center" }}>
                  <Utensils size={16} className="text-gradient" />
                  <strong style={{ fontSize: "16px" }}>{review.restaurant.name}</strong>
                </div>

                {/* Rating stars */}
                <div className="flex-center gap-1" style={{ display: "flex" }}>
                  {Array.from({ length: review.rating }).map((_, i) => (
                    <Star key={i} size={14} fill="var(--accent-yellow)" className="star-icon" />
                  ))}
                  {Array.from({ length: 5 - review.rating }).map((_, i) => (
                    <Star key={i} size={14} className="text-muted" />
                  ))}
                </div>
              </div>

              <p className="review-text" style={{ fontSize: "14px", color: "var(--text-secondary)", lineHeight: "1.5", margin: "6px 0" }}>
                "{review.comment}"
              </p>

              <div className="flex-start gap-2 text-muted" style={{ display: "flex", alignItems: "center", fontSize: "12px" }}>
                <Calendar size={12} />
                <span>Reviewed on {formatDate(review.createdAt)}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

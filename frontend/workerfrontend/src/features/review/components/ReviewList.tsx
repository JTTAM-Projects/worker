import { useAuth0 } from "@auth0/auth0-react";
import { useQuery } from "@tanstack/react-query";
import { reviewQueries } from "../queries/reviewQueries";
import ReviewCard from "./ReviewCard";
import type { ReviewListProps } from "../types";

/**
 * ReviewList Container Component
 * Fetches and displays a list of reviews for a user profile
 * Supports TASKER and EMPLOYER profile types
 */
export default function ReviewList({
  username,
  profileType,
  limit = 10,
}: ReviewListProps) {
  const { getAccessTokenSilently } = useAuth0();

  const { data, isLoading, error } = useQuery(
    reviewQueries.list(getAccessTokenSilently, username, profileType, 0, limit)
  );

  // Loading state
  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, index) => (
          <div
            key={index}
            className="bg-white border border-gray-200 rounded-lg p-4 animate-pulse"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="h-5 w-32 bg-gray-200 rounded"></div>
              <div className="h-4 w-20 bg-gray-200 rounded"></div>
            </div>
            <div className="space-y-2 mb-3">
              <div className="h-4 w-full bg-gray-200 rounded"></div>
              <div className="h-4 w-5/6 bg-gray-200 rounded"></div>
            </div>
            <div className="flex items-center justify-between pt-3 border-t border-gray-100">
              <div className="h-4 w-24 bg-gray-200 rounded"></div>
              <div className="h-4 w-32 bg-gray-200 rounded"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <span className="material-icons text-red-400 text-4xl mb-2">error_outline</span>
        <p className="text-red-700 font-medium mb-1">Failed to load reviews</p>
        <p className="text-red-600 text-sm">
          {error instanceof Error ? error.message : "An unexpected error occurred"}
        </p>
      </div>
    );
  }

  // Empty state
  if (!data || data.content.length === 0) {
    const emptyMessage =
      profileType === "TASKER"
        ? "No reviews as a tasker yet"
        : "No reviews as an employer yet";

    return (
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
        <span className="material-icons text-gray-300 text-5xl mb-3">rate_review</span>
        <p className="text-gray-600 font-medium mb-1">{emptyMessage}</p>
        <p className="text-gray-500 text-sm">
          Reviews will appear here once tasks are completed
        </p>
      </div>
    );
  }

  // Success state - render reviews
  const reviews = data.content.slice(0, limit);

  return (
    <div className="space-y-4">
      {/* Review count header */}
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg font-semibold text-gray-800">
          {profileType === "TASKER" ? "Reviews as Tasker" : "Reviews as Employer"}
        </h3>
        <span className="text-sm text-gray-600">
          {data.totalElements} {data.totalElements === 1 ? "review" : "reviews"}
        </span>
      </div>

      {/* Review list */}
      <div className="space-y-4">
        {reviews.map((review) => (
          <ReviewCard key={review.id} review={review} />
        ))}
      </div>

      {/* Show if there are more reviews */}
      {data.totalElements > limit && (
        <div className="text-center pt-4">
          <p className="text-sm text-gray-500">
            Showing {limit} of {data.totalElements} reviews
          </p>
        </div>
      )}
    </div>
  );
}

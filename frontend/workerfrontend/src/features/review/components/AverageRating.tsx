import { useAuth0 } from "@auth0/auth0-react";
import { useQuery } from "@tanstack/react-query";
import { reviewQueries } from "../queries/reviewQueries";
import { StarRating } from "../../../ui-library";
import type { AverageRatingProps } from "../types";

/**
 * AverageRating Component
 * Displays the average rating and total count for a user
 */
export default function AverageRating({ username }: AverageRatingProps) {
  const { getAccessTokenSilently } = useAuth0();

  const { data: averageRating, isLoading, error } = useQuery(
    reviewQueries.average(getAccessTokenSilently, username)
  );

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 text-gray-400">
        <div className="animate-pulse flex items-center gap-2">
          <div className="h-5 w-20 bg-gray-200 rounded"></div>
          <div className="h-4 w-16 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-sm text-red-600">
        Failed to load rating
      </div>
    );
  }

  // No reviews case
  if (averageRating === null) {
    return (
      <div className="flex items-center gap-2 text-gray-500">
        <StarRating rating={0} size="md" />
        <span className="text-sm">No reviews yet</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <StarRating rating={averageRating ?? 0} size="md" showNumber />
    </div>
  );
}

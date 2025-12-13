import { queryOptions } from "@tanstack/react-query";
import { getReviews, getAverageRating } from "../api/reviewApi";
import type { ReviewProfileType } from "../types";

/**
 * TanStack Query configurations for review-related queries
 */
export const reviewQueries = {
  /**
   * Fetch reviews for a user profile (tasker or employer)
   * @param getAccessTokenSilently Auth0 token function
   * @param username Username of the person being reviewed
   * @param profileType TASKER or EMPLOYER
   * @param page Page number (0-indexed)
   * @param size Items per page
   */
  list: (
    getAccessTokenSilently: () => Promise<string>,
    username: string,
    profileType: ReviewProfileType,
    page = 0,
    size = 10,
  ) =>
    queryOptions({
      queryKey: ["reviews", username, profileType, page, size],
      queryFn: () => getReviews(getAccessTokenSilently, username, profileType, page, size),
      staleTime: 5 * 60 * 1000, // 5 minutes
      enabled: !!username, // Only run if username is provided
    }),

  /**
   * Fetch average rating for a user
   * @param getAccessTokenSilently Auth0 token function
   * @param username Username to get average rating for
   */
  average: (getAccessTokenSilently: () => Promise<string>, username: string) =>
    queryOptions({
      queryKey: ["reviews", "average", username],
      queryFn: () => getAverageRating(getAccessTokenSilently, username),
      staleTime: 5 * 60 * 1000, // 5 minutes
      enabled: !!username, // Only run if username is provided
    }),
};

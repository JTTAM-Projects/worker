import type { Review, ReviewRequest, Page, ReviewProfileType } from "../types";

const API_BASE_URL = "http://localhost:8080/api";

/**
 * Fetch reviews for a user profile
 * @param getAccessTokenSilently Auth0 token function
 * @param username Username of the person being reviewed
 * @param profileType TASKER (as task performer) or EMPLOYER (as task creator)
 * @param page Page number (0-indexed)
 * @param size Items per page
 * @returns Paginated review response
 */
export async function getReviews(
  getAccessTokenSilently: () => Promise<string>,
  username: string,
  profileType: ReviewProfileType,
  page = 0,
  size = 10
): Promise<Page<Review>> {
  const token = await getAccessTokenSilently();
  const endpoint = profileType === 'TASKER' ? 'tasker' : 'employer';
  
  const queryParams = new URLSearchParams({
    page: page.toString(),
    size: size.toString(),
  });

  const response = await fetch(
    `${API_BASE_URL}/reviews/${endpoint}/${username}?${queryParams}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    const text = await response.text().catch(() => "");
    throw new Error(`Failed to fetch reviews: ${response.status} ${text}`);
  }

  return response.json();
}

/**
 * Fetch average rating for a user
 * @param getAccessTokenSilently Auth0 token function
 * @param username Username to get average rating for
 * @returns Average rating or null if no reviews exist
 */
export async function getAverageRating(
  getAccessTokenSilently: () => Promise<string>,
  username: string
): Promise<number | null> {
  const token = await getAccessTokenSilently();

  const response = await fetch(
    `${API_BASE_URL}/reviews/average/${username}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  // 204 No Content means no reviews
  if (response.status === 204) {
    return null;
  }

  if (!response.ok) {
    const text = await response.text().catch(() => "");
    throw new Error(`Failed to fetch average rating: ${response.status} ${text}`);
  }

  return response.json();
}

/**
 * Create a new review
 * @param getAccessTokenSilently Auth0 token function
 * @param payload Review data
 * @returns Created review
 */
export async function createReview(
  getAccessTokenSilently: () => Promise<string>,
  payload: ReviewRequest
): Promise<Review> {
  const token = await getAccessTokenSilently();
  const response = await fetch(`${API_BASE_URL}/reviews`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const text = await response.text().catch(() => "");
    throw new Error(`Failed to create review: ${response.status} ${text}`);
  }

  return response.json();
}

/**
 * Update an existing review
 * @param getAccessTokenSilently Auth0 token function
 * @param reviewId ID of the review to update
 * @param payload Updated review data
 * @returns Updated review
 */
export async function updateReview(
  getAccessTokenSilently: () => Promise<string>,
  reviewId: number,
  payload: ReviewRequest
): Promise<Review> {
  const token = await getAccessTokenSilently();
  const response = await fetch(`${API_BASE_URL}/reviews/${reviewId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const text = await response.text().catch(() => "");
    throw new Error(`Failed to update review: ${response.status} ${text}`);
  }

  return response.json();
}

/**
 * Delete a review
 * @param getAccessTokenSilently Auth0 token function
 * @param reviewId ID of the review to delete
 */
export async function deleteReview(
  getAccessTokenSilently: () => Promise<string>,
  reviewId: number
): Promise<void> {
  const token = await getAccessTokenSilently();
  const response = await fetch(`${API_BASE_URL}/reviews/${reviewId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const text = await response.text().catch(() => "");
    throw new Error(`Failed to delete review: ${response.status} ${text}`);
  }
}
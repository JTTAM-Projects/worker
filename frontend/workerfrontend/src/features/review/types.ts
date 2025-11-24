// ============================================================================
// Review Types - Matching Backend DTOs
// ============================================================================

/**
 * Review response from backend (matches ReviewResponse.java)
 */
export interface Review {
  id: number;
  taskId: number;
  taskTitle: string;
  taskCategories: string[];  // Task categories (e.g., ["GARDEN", "CLEANING"])
  reviewerUsername: string;  // Person who wrote the review
  revieweeUsername: string;  // Person being reviewed
  rating: number;            // 1-5
  comment: string | null;    // Max 1000 chars, nullable
  createdAt: string;         // ISO 8601 timestamp
  updatedAt: string;         // ISO 8601 timestamp
}

/**
 * Request body for creating/updating a review (matches ReviewRequest.java)
 */
export interface ReviewRequest {
  taskId: number;
  revieweeUsername: string;
  rating: number;            // 1-5
  comment?: string;          // Optional, max 1000 chars
}

/**
 * Spring Data Page wrapper for paginated responses
 */
export interface Page<T> {
  content: T[];
  pageable: {
    pageNumber: number;
    pageSize: number;
    sort: {
      sorted: boolean;
      unsorted: boolean;
      empty: boolean;
    };
    offset: number;
    paged: boolean;
    unpaged: boolean;
  };
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
  empty: boolean;
  numberOfElements: number;
  sort: {
    sorted: boolean;
    unsorted: boolean;
    empty: boolean;
  };
}

/**
 * Average rating response
 */
export interface AverageRating {
  average: number;
  count: number;
}

// ============================================================================
// Component Props
// ============================================================================

/**
 * Profile type for determining which reviews to fetch
 */
export type ReviewProfileType = 'TASKER' | 'EMPLOYER';

/**
 * Props for ReviewList component
 */
export interface ReviewListProps {
  profileType: ReviewProfileType;
  limit?: number;  // Default: 10
}

/**
 * Props for ReviewCard component
 */
export interface ReviewCardProps {
  review: Review;
}

/**
 * Props for AverageRating component
 */
export interface AverageRatingProps {
  // No props needed when using loader data
}

/**
 * Props for CreateReview component (existing)
 */
export interface CreateReviewProps {
  taskId: number;
  revieweeUsername: string;
  submitRoute: () => void;
  cancelRoute: () => void;
}
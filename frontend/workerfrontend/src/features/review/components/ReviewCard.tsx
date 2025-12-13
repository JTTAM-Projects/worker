import type { ReviewCardProps } from "../types";
import { StarRating } from "../../../ui-library";

// Category icon mapping (same as TaskCard)
const CATEGORY_ICON_MAP: Record<string, string> = {
  GARDEN: "yard",
  CLEANING: "cleaning_services",
  MOVING: "local_shipping",
  HOUSEHOLD: "home",
  REPAIR: "build",
  PAINTING: "format_paint",
  "SNOW REMOVAL": "ac_unit",
  "FOREST WORK": "park",
  YARD: "grass",
  OTHER: "handyman",
};
const DEFAULT_ICON = "work";

/**
 * Gets the corresponding Material Icon name for a category
 */
const getCategoryIcon = (categoryTitle?: string): string => {
  const key = (categoryTitle || "").toUpperCase();
  return CATEGORY_ICON_MAP[key] || DEFAULT_ICON;
};

/**
 * ReviewCard Component
 * Displays a single review with rating, comment, reviewer info, and date
 */
export default function ReviewCard({ review }: ReviewCardProps) {
  // Format date to relative time or absolute date
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInDays === 0) {
      return "Today";
    } else if (diffInDays === 1) {
      return "Yesterday";
    } else if (diffInDays < 7) {
      return `${diffInDays} days ago`;
    } else if (diffInDays < 30) {
      const weeks = Math.floor(diffInDays / 7);
      return `${weeks} ${weeks === 1 ? "week" : "weeks"} ago`;
    } else {
      // Show absolute date
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    }
  };

  // Get the first category icon for the task
  const categoryIcon =
    review.taskCategories && review.taskCategories.length > 0
      ? getCategoryIcon(review.taskCategories[0])
      : DEFAULT_ICON;

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-3 hover:shadow-sm transition-shadow">
      {/* Header: Rating and Date */}
      <div className="flex items-start justify-between mb-2">
        <StarRating rating={review.rating} size="sm" showNumber />
        <span className="text-xs text-gray-500">{formatDate(review.createdAt)}</span>
      </div>

      {/* Comment */}
      {review.comment && (
        <p className="text-sm text-gray-700 mb-2 line-clamp-2" title={review.comment}>
          {review.comment}
        </p>
      )}

      {/* Footer: Reviewer and Task Info */}
      <div className="flex items-center justify-between text-xs text-gray-600 pt-2 border-t border-gray-100">
        <div className="flex items-center gap-1.5">
          <span className="material-icons text-gray-400" style={{ fontSize: "16px" }}>
            person
          </span>
          <span className="font-medium">{review.reviewerUsername}</span>
        </div>

        {review.taskTitle && (
          <div className="flex items-center gap-1 text-gray-500 max-w-[180px] truncate">
            <span className="material-icons" style={{ fontSize: "14px" }}>
              {categoryIcon}
            </span>
            <span className="truncate" title={review.taskTitle}>
              {review.taskTitle}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

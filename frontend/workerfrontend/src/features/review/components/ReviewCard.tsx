import type { ReviewCardProps } from "../types";
import { StarRating } from "../../../ui-library";

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

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
      {/* Header: Rating and Date */}
      <div className="flex items-start justify-between mb-3">
        <StarRating rating={review.rating} size="md" showNumber />
        <span className="text-sm text-gray-500">
          {formatDate(review.createdAt)}
        </span>
      </div>

      {/* Comment */}
      {review.comment && (
        <p className="text-gray-700 mb-3 whitespace-pre-wrap break-words">
          {review.comment}
        </p>
      )}

      {/* Footer: Reviewer and Task Info */}
      <div className="flex items-center justify-between text-sm text-gray-600 pt-3 border-t border-gray-100">
        <div className="flex items-center gap-2">
          <span className="material-icons text-gray-400" style={{ fontSize: "18px" }}>
            person
          </span>
          <span className="font-medium">{review.reviewerUsername}</span>
        </div>
        
        {review.taskTitle && (
          <div className="flex items-center gap-1 text-gray-500 max-w-[200px] truncate">
            <span className="material-icons" style={{ fontSize: "16px" }}>
              work_outline
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

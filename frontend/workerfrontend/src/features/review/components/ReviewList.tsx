import ReviewCard from "./ReviewCard";
import type { ReviewListProps, Page, Review } from "../types";

/**
 * ReviewList Container Component
 * Displays a list of reviews for a user profile
 * Supports TASKER and EMPLOYER profile types
 */
export default function ReviewList({
    reviews,
    profileType,
    limit = 10,
}: ReviewListProps & { reviews: Page<Review> | null }) {
    // Empty state
    if (!reviews || reviews.content.length === 0) {
        const emptyMessage =
            profileType === "TASKER" ? "Ei vielä arvosteluja työntekijänä" : "Ei vielä arvosteluja työnantajana";

        return (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
                <span className="material-icons text-gray-300 text-5xl mb-3">rate_review</span>
                <p className="text-gray-600 font-medium mb-1">{emptyMessage}</p>
                <p className="text-gray-500 text-sm">Arvostelut näkyvät täällä kun työtehtäviä on suoritettu</p>
            </div>
        );
    }

    // Success state - render reviews
    const reviewsToShow = reviews.content.slice(0, limit);

    return (
        <div className="flex flex-col h-full">
            {/* Review count header */}
            <div className="flex items-center justify-between mb-3 flex-shrink-0">
                <h3 className="text-lg font-semibold text-gray-800">
                    {profileType === "TASKER" ? "Arvostelut työntekijänä" : "Arvostelut työnantajana"}
                </h3>
                <span className="text-sm text-gray-600">
                    {reviews.totalElements} {reviews.totalElements === 1 ? "arvostelu" : "arvostelua"}
                </span>
            </div>

            {/* Scrollable review list container */}
            <div className="flex-1 overflow-y-auto max-h-[600px] pr-2 space-y-3">
                {reviewsToShow.map((review) => (
                    <ReviewCard key={review.id} review={review} />
                ))}
            </div>

            {/* Show if there are more reviews */}
            {reviews.totalElements > limit && (
                <div className="text-center pt-3 mt-2 border-t border-gray-200 flex-shrink-0">
                    <p className="text-sm text-gray-500">
                        Näytetään {limit} / {reviews.totalElements} arvostelua
                    </p>
                </div>
            )}
        </div>
    );
}

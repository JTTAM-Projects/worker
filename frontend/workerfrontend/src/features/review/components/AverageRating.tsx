import { StarRating } from "../../../ui-library";
import type { AverageRatingProps } from "../types";

/**
 * AverageRating Component
 * Displays the average rating for a user
 */
export default function AverageRating({ averageRating }: AverageRatingProps & { averageRating: number | null }) {
    // No reviews case
    if (averageRating === null) {
        return (
            <div className="flex items-center gap-2 text-gray-500">
                <StarRating rating={0} size="md" />
                <span className="text-sm">Ei vielä arvosteluja</span>
            </div>
        );
    }

    return (
        <div className="flex items-center gap-2">
            <StarRating rating={averageRating ?? 0} size="md" showNumber />
        </div>
    );
}

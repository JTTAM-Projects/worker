// REFERENCE PAGE: Keep this for Jaakkola to verify component behavior
// This page demonstrates correct usage of ReviewList, ReviewCard, and AverageRating components
// Use this to compare against your profile page implementation if something doesn't work

/**
 * Backend API Documentation (Verified 2025-11-24)
 * 
 * Endpoints:
 * - GET /api/reviews/tasker/{username}?page=0&size=10
 *   Returns: Page<ReviewResponse> - Reviews where user was the tasker (task performer)
 * 
 * - GET /api/reviews/employer/{username}?page=0&size=10
 *   Returns: Page<ReviewResponse> - Reviews where user was the employer (task creator)
 * 
 * - GET /api/reviews/average/{username}
 *   Returns: Double (or 204 No Content if no reviews)
 * 
 * ReviewResponse Structure:
 * {
 *   id: number;
 *   taskId: number;
 *   taskTitle: string;
 *   reviewerUsername: string;  // Person who wrote the review
 *   revieweeUsername: string;  // Person being reviewed
 *   rating: number;            // 1-5
 *   comment: string;           // Max 1000 chars, nullable
 *   createdAt: string;         // ISO 8601 timestamp
 *   updatedAt: string;         // ISO 8601 timestamp
 * }
 * 
 * Page<T> Structure (Spring Data):
 * {
 *   content: T[];
 *   pageable: { pageNumber, pageSize, sort, ... };
 *   totalElements: number;
 *   totalPages: number;
 *   size: number;
 *   number: number;
 *   first: boolean;
 *   last: boolean;
 *   empty: boolean;
 * }
 */

import { createFileRoute, Link } from "@tanstack/react-router";
import { ReviewList, AverageRating } from "../../features/review";

export const Route = createFileRoute("/_authenticated/test-reviews")({
  component: TestReviewsPage,
});

function TestReviewsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b px-6 py-4 mb-8">
        <div className="flex items-center gap-4">
          <Link to="/" className="text-blue-600 hover:text-blue-800">
            ← Back to Home
          </Link>
          <h1 className="text-xl font-semibold">Test Reviews Page</h1>
        </div>
      </nav>
      <div className="container mx-auto p-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Review Component Testing</h1>
        <p className="text-gray-600">
          ⚠️ This is a temporary test page for developing review components
        </p>
      </div>

      <div className="space-y-8">
        {/* User selection info */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <span className="material-icons text-blue-600" style={{ fontSize: "24px" }}>
              info
            </span>
            <div>
              <h3 className="font-semibold text-blue-900 mb-1">Test Data Overview</h3>
              <p className="text-sm text-blue-800 mb-2">
                <strong>User1:</strong> 11 tasker reviews + 5 employer reviews (16 total)<br />
                <strong>User2:</strong> 4 tasker reviews + 3 employer reviews (7 total)<br />
                <strong>User3:</strong> 2 tasker reviews (2 total)
              </p>
              <p className="text-xs text-blue-700">
                Reviews are paginated (default 10 per page). User1 will show "Showing 10 of 11" for tasker reviews with scrolling.
                Task icons match the category (yard, cleaning_services, local_shipping, etc.)
                Average ratings are displayed for each user.
              </p>
            </div>
          </div>
        </div>

        {/* Test Section 1: User1 - Full Profile */}
        <section className="border border-gray-300 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">1. User1 - Complete Profile Test</h2>
          <div className="space-y-6">
            <div>
              <h3 className="text-md font-medium mb-3 text-gray-700">Average Rating:</h3>
              <AverageRating username="User1" />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-md font-medium mb-3 text-gray-700">
                  As Tasker (11 reviews - pagination/scroll test):
                </h3>
                <ReviewList username="User1" profileType="TASKER" limit={10} />
              </div>
              <div>
                <h3 className="text-md font-medium mb-3 text-gray-700">
                  As Employer (5 reviews):
                </h3>
                <ReviewList username="User1" profileType="EMPLOYER" limit={10} />
              </div>
            </div>
          </div>
        </section>

        {/* Test Section 2: User2 - Moderate Reviews */}
        <section className="border border-gray-300 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">2. User2 - Moderate Activity</h2>
          <div className="space-y-6">
            <div>
              <h3 className="text-md font-medium mb-3 text-gray-700">Average Rating:</h3>
              <AverageRating username="User2" />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-md font-medium mb-3 text-gray-700">
                  As Tasker (4 reviews):
                </h3>
                <ReviewList username="User2" profileType="TASKER" limit={10} />
              </div>
              <div>
                <h3 className="text-md font-medium mb-3 text-gray-700">
                  As Employer (3 reviews):
                </h3>
                <ReviewList username="User2" profileType="EMPLOYER" limit={10} />
              </div>
            </div>
          </div>
        </section>

        {/* Test Section 3: User3 - Minimal Reviews */}
        <section className="border border-gray-300 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">3. User3 - Minimal Activity</h2>
          <div className="space-y-6">
            <div>
              <h3 className="text-md font-medium mb-3 text-gray-700">Average Rating:</h3>
              <AverageRating username="User3" />
            </div>
            
            <div>
              <h3 className="text-md font-medium mb-3 text-gray-700">
                As Tasker (2 reviews):
              </h3>
              <ReviewList username="User3" profileType="TASKER" limit={10} />
            </div>
            <div className="mt-4">
              <h3 className="text-md font-medium mb-3 text-gray-700">
                As Employer (should show empty state):
              </h3>
              <ReviewList username="User3" profileType="EMPLOYER" limit={10} />
            </div>
          </div>
        </section>

        {/* Test Section 4: Category Icons Verification */}
        <section className="border border-gray-300 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">4. Category Icons Test</h2>
          <p className="text-sm text-gray-600 mb-3">
            Verify that task icons match categories (yard, cleaning_services, local_shipping, etc.)
          </p>
          <ReviewList username="User1" profileType="TASKER" limit={5} />
        </section>
      </div>

      <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded">
        <p className="text-sm text-blue-800 mb-2">
          <strong>Reference Implementation Guide for Jaakkola:</strong>
        </p>
        <ul className="text-sm text-blue-700 list-disc list-inside space-y-1">
          <li>ReviewList, ReviewCard, and AverageRating components are fully functional</li>
          <li>This page shows correct usage patterns for all three components</li>
          <li>If your profile page implementation doesn't work as shown here, compare your props and component structure</li>
          <li>Backend test data: User1 (11T+5E), User2 (4T+3E), User3 (2T+0E)</li>
          <li>Components handle loading states, empty states, and scrolling automatically</li>
        </ul>
      </div>
      </div>
    </div>
  );
}

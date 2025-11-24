// TEMPORARY: Delete this file before creating PR
// This page is only for testing review components during development

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
        <section className="border border-gray-300 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Tasker Reviews</h2>
          <div className="bg-gray-50 p-4 rounded">
            <p className="text-gray-500">ReviewList component will be placed here</p>
            <code className="text-sm">
              {`<ReviewList username="testuser" profileType="TASKER" />`}
            </code>
          </div>
        </section>

        <section className="border border-gray-300 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Employer Reviews</h2>
          <div className="bg-gray-50 p-4 rounded">
            <p className="text-gray-500">ReviewList component will be placed here</p>
            <code className="text-sm">
              {`<ReviewList username="testuser" profileType="EMPLOYER" />`}
            </code>
          </div>
        </section>

        <section className="border border-gray-300 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Average Rating Display</h2>
          <div className="bg-gray-50 p-4 rounded">
            <p className="text-gray-500">AverageRating component will be placed here</p>
            <code className="text-sm">
              {`<AverageRating username="testuser" />`}
            </code>
          </div>
        </section>
      </div>

      <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded">
        <p className="text-sm text-yellow-800">
          <strong>Note:</strong> This page will be deleted before the PR is merged.
          Components developed here will be integrated into the profile pages by Jaakkola.
        </p>
      </div>
      </div>
    </div>
  );
}

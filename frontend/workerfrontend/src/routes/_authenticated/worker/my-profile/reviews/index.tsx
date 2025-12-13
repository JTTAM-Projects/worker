import { createFileRoute, useLoaderData } from "@tanstack/react-router";
import { getReviews, getAverageRating } from "../../../../../features/review/api/reviewApi";
import { ReviewList, AverageRating } from "../../../../../features/review";

export const Route = createFileRoute("/_authenticated/worker/my-profile/reviews/")({
  loader: async ({ context }) => {
    const username = (context.auth.user as { sub: string }).sub;
    const [reviews, averageRating] = await Promise.all([
      getReviews(context.auth.getAccessToken, username, "TASKER", 0, 10),
      getAverageRating(context.auth.getAccessToken, username),
    ]);
    return { reviews, averageRating };
  },
  component: RouteComponent,
});

function RouteComponent() {
  const { reviews, averageRating } = useLoaderData({ from: Route.id });

  return (
    <div className="container mx-auto px-6 py-12 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Arvostelut</h1>
        <p className="text-gray-600">Katso mitä asiakkaat ovat sanoneet työstäsi</p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
        <h2 className="text-lg font-semibold mb-4 text-gray-900">Kokonaiskeskiarvo</h2>
        <AverageRating averageRating={averageRating} />
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold mb-4 text-gray-900">Arvostelut työntekijänä</h2>
        <ReviewList reviews={reviews} profileType="TASKER" limit={10} />
      </div>
    </div>
  );
}

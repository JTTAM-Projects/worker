import { createRootRouteWithContext, Link, Outlet } from "@tanstack/react-router";
import Header from "../features/layoutcomponents/Header";
import Footer from "../features/layoutcomponents/Footer";
import type { QueryClient } from "@tanstack/react-query";

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient;
}>()({
  component: () => {
    return (
      <div className="bg-gray-50 min-h-screen w-full">
        <Header />
        <Outlet />
        <Footer />
      </div>
    );
  },
  notFoundComponent: () => {
    return (
      <div>
        <p>This is the notFoundComponent configured on root route</p>
        <Link to="/">Start Over</Link>
      </div>
    );
  },
});

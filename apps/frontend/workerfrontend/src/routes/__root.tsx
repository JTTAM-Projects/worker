import { createRootRouteWithContext, Link, Outlet } from "@tanstack/react-router";
import Footer from "../features/layoutcomponents/Footer";
import type { QueryClient } from "@tanstack/react-query";
import type { Auth0ContextType } from "../auth/auth0";

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient;
  auth: Auth0ContextType;
}>()({
  component: () => {
    return (
      <div className="bg-gray-50 min-h-screen w-full">
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

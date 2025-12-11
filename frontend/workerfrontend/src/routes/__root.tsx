import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";
import type { QueryClient } from "@tanstack/react-query";
import type { Auth0ContextType } from "../auth/auth0";
import NotFoundComponent from "../ui-library/routeComponents/PageNotFoundComponent";

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient;
  auth: Auth0ContextType;
}>()({
  component: () => {
    return (
      <div className="bg-gray-50 min-h-screen w-full">
        <Outlet />
      </div>
    );
  },
  notFoundComponent: () => {
    return (
      <div className="h-full">
        <NotFoundComponent />
      </div>
    );
  },
});

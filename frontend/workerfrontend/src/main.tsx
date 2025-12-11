import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { createRouter, RouterProvider } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";
import { Auth0Wrapper, useAuth0Context, type Auth0ContextType } from "./auth/auth0";
import NotFoundComponent from "./ui-library/routeComponents/PageNotFoundComponent";
import ErrorComponent from "./ui-library/routeComponents/ErrorComponent";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      refetchOnWindowFocus: false,
    },
  },
});

// Create router instance that will be shared
const router = createRouter({
  routeTree,
  context: {
    queryClient,
    auth: undefined! as Auth0ContextType,
  },
  defaultPreload: "intent",
  // Since we're using React Query, we don't want loader calls to ever be stale
  // This will ensure that the loader is always called when the route is preloaded or visited
  defaultPreloadStaleTime: 0,
  scrollRestoration: true,
  defaultNotFoundComponent: NotFoundComponent,
  defaultErrorComponent: ErrorComponent,
});

// eslint-disable-next-line react-refresh/only-export-components
function InnerApp() {
  const auth = useAuth0Context();

  return <RouterProvider router={router} context={{ queryClient, auth }} />;
}
// eslint-disable-next-line react-refresh/only-export-components
function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Auth0Wrapper>
        <InnerApp />
      </Auth0Wrapper>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);

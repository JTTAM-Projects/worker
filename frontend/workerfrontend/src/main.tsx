import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { Auth0Provider } from "@auth0/auth0-react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { createRouter, RouterProvider } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      refetchOnWindowFocus: false,
    },
  },
});

type Auth0AppState = {
  returnTo?: string;
};

const onRedirectCallback = (appState?: Auth0AppState) => {
  const targetUrl = appState?.returnTo ?? window.location.pathname;
  window.history.replaceState({}, document.title, targetUrl);
  window.dispatchEvent(new PopStateEvent("popstate"));
};

const router = createRouter({
  routeTree,
  context: {
    queryClient,
  },
  defaultPreload: "intent",
  // Since we're using React Query, we don't want loader calls to ever be stale
  // This will ensure that the loader is always called when the route is preloaded or visited
  defaultPreloadStaleTime: 0,
  scrollRestoration: true,
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <Auth0Provider
        domain="jk-projects.eu.auth0.com"
        clientId="aDYOG7a9fYDDBoTgWX9AW3BKYdv6XdlJ"
        authorizationParams={{
          redirect_uri: window.location.origin,
          audience: "https://glig.com",
        }}
        onRedirectCallback={onRedirectCallback}
      >
        <RouterProvider router={router} />
      </Auth0Provider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  </StrictMode>
);

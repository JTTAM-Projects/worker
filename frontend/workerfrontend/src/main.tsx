import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { Auth0Provider } from "@auth0/auth0-react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

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

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Auth0Provider
          domain="jk-projects.eu.auth0.com"
          clientId="aDYOG7a9fYDDBoTgWX9AW3BKYdv6XdlJ"
          authorizationParams={{
            redirect_uri: window.location.origin,
            audience: "https://glig.com",
          }}
          onRedirectCallback={onRedirectCallback}
        >
          <App />
        </Auth0Provider>
      </BrowserRouter>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  </StrictMode>
);

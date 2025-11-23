import { Auth0Provider } from "@auth0/auth0-react";

type Auth0AppState = {
  returnTo?: string;
};

const onRedirectCallback = (appState?: Auth0AppState) => {
  const targetUrl = appState?.returnTo ?? window.location.pathname;
  window.history.replaceState({}, document.title, targetUrl);
  window.dispatchEvent(new PopStateEvent("popstate"));
};

export function Auth0Wrapper({ children }: { children: React.ReactNode }) {
  if (import.meta.env.VITE_AUTH_MODE === "mock") {
    return <>{children}</>;
  }

  return (
    <Auth0Provider
      domain="jk-projects.eu.auth0.com"
      clientId="aDYOG7a9fYDDBoTgWX9AW3BKYdv6XdlJ"
      authorizationParams={{
        redirect_uri: window.location.origin,
        audience: "https://glig.com",
        scope: "openid profile email offline_access",
      }}
      onRedirectCallback={onRedirectCallback}
      useRefreshTokens={true}
      cacheLocation="localstorage"
    >
      {children}
    </Auth0Provider>
  );
}

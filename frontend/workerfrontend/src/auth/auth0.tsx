import { Auth0Provider, useAuth0 } from "@auth0/auth0-react";
import { createContext, useContext } from "react";

type Auth0AppState = {
  returnTo?: string;
};

const onRedirectCallback = (appState?: Auth0AppState) => {
  const targetUrl = appState?.returnTo ?? window.location.pathname;
  window.history.replaceState({}, document.title, targetUrl);
  window.dispatchEvent(new PopStateEvent("popstate"));
};

export interface Auth0ContextType {
  isAuthenticated: boolean;
  user: unknown;
  login: () => void;
  logout: () => void;
  isLoading: boolean;
  getAccessToken: () => Promise<string>;
}

const Auth0Context = createContext<Auth0ContextType | undefined>(undefined);

export function Auth0Wrapper({ children }: { children: React.ReactNode }) {
  return (
    <Auth0Provider
      domain={import.meta.env.VITE_AUTH_DOMAIN}
      clientId={import.meta.env.VITE_AUTH_CLIENT_ID}
      authorizationParams={{
        redirect_uri: window.location.origin,
        audience: import.meta.env.VITE_AUTH_AUDIENCE,
        scope: "openid profile email offline_access",
      }}
      onRedirectCallback={onRedirectCallback}
      useRefreshTokens={true}
    >
      <Auth0ContextProvider>{children}</Auth0ContextProvider>
    </Auth0Provider>
  );
}

function Auth0ContextProvider({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, user, loginWithRedirect, logout, isLoading, getAccessTokenSilently } = useAuth0();

  const contextValue = {
    isAuthenticated,
    user,
    login: loginWithRedirect,
    logout: () => logout({ logoutParams: { returnTo: "/" } }),
    isLoading,
    getAccessToken: getAccessTokenSilently,
  };

  return <Auth0Context.Provider value={contextValue}>{children}</Auth0Context.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth0Context() {
  const context = useContext(Auth0Context);
  if (context === undefined) {
    throw new Error("useAuth0Context must be used within Auth0Wrapper");
  }
  return context;
}

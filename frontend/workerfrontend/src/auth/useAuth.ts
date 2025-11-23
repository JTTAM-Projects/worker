import { useAuth0 } from "@auth0/auth0-react";

const mockUser = {
  sub: "auth0|mock-user",
  email: "mock.user@example.com",
  given_name: "Mock",
  family_name: "User",
  userName: "mock.user",
};

export type AuthInfo = {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: unknown;
  loginWithRedirect: (...args: Parameters<ReturnType<typeof useAuth0>["loginWithRedirect"]>) => ReturnType<
    ReturnType<typeof useAuth0>["loginWithRedirect"]
  >;
  logout: ReturnType<typeof useAuth0>["logout"];
  getAccessTokenSilently: () => Promise<string>;
  getAccessToken: () => Promise<string>;
};

const isMock = import.meta.env.VITE_AUTH_MODE === "mock"; // mock-tila ohittaa Auth0:n testeissä ja lokissa

export function useAuth(): AuthInfo {
  if (isMock) {
    // Testeissä palautetaan aina sama käyttäjä ilman Auth0-redirecttejä
    return {
      isAuthenticated: true,
      isLoading: false,
      user: mockUser,
      loginWithRedirect: async () => {},
      logout: async () => {},
      getAccessTokenSilently: async () => "mock-token",
      getAccessToken: async () => "mock-token",
    };
  }

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const auth = useAuth0();
  return {
    ...auth,
    getAccessToken: auth.getAccessTokenSilently,
  };
}

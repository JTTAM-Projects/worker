import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { Auth0Provider } from "@auth0/auth0-react";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Auth0Provider
        domain="jk-projects.eu.auth0.com"
        clientId="aDYOG7a9fYDDBoTgWX9AW3BKYdv6XdlJ"
        authorizationParams={{
          redirect_uri: window.location.origin,
          audience: "https://jk-projects.eu.auth0.com/api/v2/",
          scope: "openid profile email read:current_user update:current_user_metadata"
        }}
      >
        <App />
      </Auth0Provider>
    </BrowserRouter>
  </StrictMode>
);

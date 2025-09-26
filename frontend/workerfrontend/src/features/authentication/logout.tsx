import { useAuth0 } from "@auth0/auth0-react";
import React from "react";

const LogoutButton = () => {
  const { logout } = useAuth0();

  return (
    <button
      className="
      border border-gray-300 
      px-4 py-2 rounded-md 
      hover:bg-gray-100 
      hover:border-green-400 
      text-sm 
      font-medium"
      onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}
      >
      Log Out
    </button>
  );
};

export default LogoutButton;
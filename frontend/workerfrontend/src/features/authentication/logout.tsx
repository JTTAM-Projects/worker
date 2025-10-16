import { useAuth0 } from "@auth0/auth0-react";

const LogoutButton = () => {
  const { logout } = useAuth0();

  return (
    <button
      className="
      bg-white/10
      text-white
      border-2
      border-white/30
      px-5
      py-2.5
      rounded-lg
      hover:bg-white
      hover:text-green-600
      hover:border-white
      hover:shadow-xl
      hover:scale-105
      text-sm
      font-bold
      transition-all
      duration-200
      shadow-md"
      onClick={() =>
        logout({ logoutParams: { returnTo: window.location.origin } })
      }
    >
      Kirjaudu ulos
    </button>
  );
};

export default LogoutButton;

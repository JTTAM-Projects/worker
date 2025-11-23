import { useAuth } from "../../auth/useAuth";

const LoginButton = () => {
  const { loginWithRedirect, isAuthenticated } = useAuth();

  return (
    !isAuthenticated && (
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
        onClick={() => loginWithRedirect()}
      >
        Kirjaudu
      </button>
    )
  );
};

export default LoginButton;

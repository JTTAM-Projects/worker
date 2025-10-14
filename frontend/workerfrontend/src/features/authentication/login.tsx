import { useAuth0 } from "@auth0/auth0-react";

const LoginButton = () => {
  const { loginWithRedirect } = useAuth0();

  return (
    <button
      className="
            bg-green-700 
            text-white 
            px-5
            py-2.5
            rounded-lg 
            hover:bg-white
            hover:text-green-600
            hover:shadow-xl
            hover:scale-105
            border-2
            border-green-700
            hover:border-white
            text-sm 
            font-bold
            transition-all
            duration-200
            shadow-md"
      onClick={() => loginWithRedirect()}
    >
      Kirjaudu
    </button>
  );
};

export default LoginButton;

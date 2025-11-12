import LoginButton from "../authentication/login";
import LogoutButton from "../authentication/logout";
import { useAuth0 } from "@auth0/auth0-react";
import { Link } from "@tanstack/react-router";

export default function EmployerNavBar() {
  const { isAuthenticated, loginWithRedirect } = useAuth0();
  return (
    <header className="bg-gradient-to-r from-green-600 to-green-500 shadow-lg sticky top-0 z-50 border-b-2 border-green-700">
      {/* navigaatio */}
      <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo ja navigaatio-linkit (vasen) */}
        <div className="flex items-center space-x-10">
          {/* Logo/Nimi */}
          <Link
            to="/employer"
            className="text-white font-bold text-2xl tracking-wide hover:scale-105 transition-transform duration-200"
          >
            LOGO
          </Link>

          {/* Navigaatio-linkit */}
          {/* Navigaatio-linkit */}
          <div className="hidden md:flex items-center space-x-6">
            <Link
              to="/employer/create-task"
              className="text-white/90 hover:text-white hover:underline underline-offset-4 decoration-2 font-medium transition-all duration-200"
            >
              Luo ilmoitus
            </Link>
            <Link
              to="/employer/my-tasks"
              className="text-white/90 hover:text-white hover:underline underline-offset-4 decoration-2 font-medium transition-all duration-200"
            >
              Työilmoitukseni
            </Link>
          </div>
        </div>
        {/* oikean reunan painikkeet */}
        <div className="flex items-center space-x-3">
          {isAuthenticated ? (
            <Link
              to="/employer/my-proflie"
              className="
              bg-white
              text-green-600 
              px-5
              py-2.5
              rounded-lg
              hover:bg-green-700
              hover:text-white
              hover:shadow-xl
              hover:scale-105
              text-sm 
              font-bold
              transition-all
              duration-200
              border-2
              border-white
              shadow-md"
            >
              Profiili
            </Link>
          ) : (
            <button
              onClick={() => loginWithRedirect()}
              className="
              bg-white
              text-green-600 
              px-5
              py-2.5
              rounded-lg
              hover:bg-green-700
              hover:text-white
              hover:shadow-xl
              hover:scale-105
              text-sm 
              font-bold
              transition-all
              duration-200
              border-2
              border-white
              shadow-md"
            >
              Profiili
            </button>
          )}
          <div className="hidden lg:flex items-center space-x-3">
            <LoginButton />
            <LogoutButton />
          </div>
          <button className="lg:hidden p-2 rounded-lg hover:bg-green-700 hover:scale-105 text-white transition-all duration-200 shadow-md">
            <span className="material-icons">menu</span>
          </button>
        </div>
      </nav>
    </header>
  );
}

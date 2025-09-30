import LoginButton from "../authentication/login";
import LogoutButton from "../authentication/logout";
import { Link } from "react-router-dom";

export default function Header() {
  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      {/* navigaatio */}
      <nav className="container mx-auto px-6 py-3 flex justify-between items-center">
        {/* navigaatio-linkit (vasen) */}
        <div className="hidden md:flex items-center space-x-8">
          <Link to="/" className="text-gray-600 hover:text-green-400">
            Miten toimii
          </Link>
          <Link
            to="/create-task"
            className="text-gray-600 hover:text-green-400"
          >
            Luo tehtävä
          </Link>
          <Link to="/tasks" className="text-gray-600 hover:text-green-400">
            Selaa tehtäviä
          </Link>
        </div>
        {/* oikean reunan painikkeet */}
        <div className="flex items-center space-x-4">
          <LoginButton />
          <LogoutButton />
          <button className="p-2 rounded-md hover:bg-gray-100">
            <span className="material-icons">menu</span>
          </button>
        </div>
      </nav>
    </header>
  );
}

import { Fragment } from "react";
import { Menu, MenuButton, MenuItem, MenuItems, Transition } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import LoginButton from "../authentication/login";
import LogoutButton from "../authentication/logout";
import { useAuth0 } from "@auth0/auth0-react";
import { Link } from "@tanstack/react-router";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export default function Header() {
  const { isAuthenticated, loginWithRedirect } = useAuth0();
  return (
    <header className="bg-gradient-to-r from-green-600 to-green-500 shadow-lg sticky top-0 z-50 border-b-2 border-green-700">
      {/* navigaatio */}
      <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo ja navigaatio-linkit (vasen) */}
        <div className="flex items-center space-x-10">
          {/* Logo/Nimi */}
          <Link
            to="/"
            className="text-white font-bold text-2xl tracking-wide hover:scale-105 transition-transform duration-200"
          >
            LOGO
          </Link>

          {/* Navigaatio-linkit */}
          <div className="hidden md:flex items-center space-x-6">
            {/* Etusivu -linkki */}
            <Link
              to="/"
              className="text-white/90 hover:text-white hover:underline underline-offset-4 decoration-2 font-medium transition-all duration-200"
            >
              Etusivu
            </Link>

            {/* Työilmoitukset -valikko */}
            <Menu as="div" className="relative inline-block text-left">
              <div>
                <MenuButton className="inline-flex items-center text-white/90 hover:text-white font-medium transition-all duration-200">
                  Työilmoitukset
                  <ChevronDownIcon className="ml-1 h-5 w-5" aria-hidden="true" />
                </MenuButton>
              </div>

              <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <MenuItems className="absolute left-0 z-10 mt-2 w-64 origin-top-left rounded-lg bg-white shadow-xl ring-1 ring-black ring-opacity-10 focus:outline-none">
                  <div className="py-2">
                    <MenuItem>
                      {({ focus }) => (
                        <Link
                          to="/"
                          className={classNames(
                            focus ? "bg-green-50 text-green-700" : "text-gray-700",
                            "block px-4 py-3 text-sm font-medium transition-colors duration-150"
                          )}
                        >
                          Avoimet työilmoitukset
                        </Link>
                      )}
                    </MenuItem>
                    <MenuItem>
                      {({ focus }) => (
                        <Link
                          to="/"
                          className={classNames(
                            focus ? "bg-green-50 text-green-700" : "text-gray-700",
                            "block px-4 py-3 text-sm font-medium transition-colors duration-150"
                          )}
                        >
                          Luo työilmoitus
                        </Link>
                      )}
                    </MenuItem>
                    <MenuItem>
                      {({ focus }) => (
                        <Link
                          to="/"
                          className={classNames(
                            focus ? "bg-green-50 text-green-700" : "text-gray-700",
                            "block px-4 py-3 text-sm font-medium transition-colors duration-150"
                          )}
                        >
                          Omat työilmoitukset
                        </Link>
                      )}
                    </MenuItem>
                  </div>
                </MenuItems>
              </Transition>
            </Menu>

            {/* Työhakemukset -valikko */}
            <Menu as="div" className="relative inline-block text-left">
              <div>
                <MenuButton className="inline-flex items-center text-white/90 hover:text-white font-medium transition-all duration-200">
                  Työhakemukset
                  <ChevronDownIcon className="ml-1 h-5 w-5" aria-hidden="true" />
                </MenuButton>
              </div>

              <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <MenuItems className="absolute left-0 z-10 mt-2 w-64 origin-top-left rounded-lg bg-white shadow-xl ring-1 ring-black ring-opacity-10 focus:outline-none">
                  <div className="py-2">
                    <MenuItem>
                      {({ focus }) => (
                        <Link
                          to="/"
                          className={classNames(
                            focus ? "bg-green-50 text-green-700" : "text-gray-700",
                            "block px-4 py-3 text-sm font-medium transition-colors duration-150"
                          )}
                        >
                          Aktiiviset hakemukset
                        </Link>
                      )}
                    </MenuItem>
                    <MenuItem>
                      {({ focus }) => (
                        <Link
                          to="/"
                          className={classNames(
                            focus ? "bg-green-50 text-green-700" : "text-gray-700",
                            "block px-4 py-3 text-sm font-medium transition-colors duration-150"
                          )}
                        >
                          Hyväksytyt hakemukset
                        </Link>
                      )}
                    </MenuItem>
                    <MenuItem>
                      {({ focus }) => (
                        <Link
                          to="/"
                          className={classNames(
                            focus ? "bg-green-50 text-green-700" : "text-gray-700",
                            "block px-4 py-3 text-sm font-medium transition-colors duration-150"
                          )}
                        >
                          Vasta-tarjoukset
                        </Link>
                      )}
                    </MenuItem>
                    <MenuItem>
                      {({ focus }) => (
                        <Link
                          to="/"
                          className={classNames(
                            focus ? "bg-green-50 text-green-700" : "text-gray-700",
                            "block px-4 py-3 text-sm font-medium transition-colors duration-150"
                          )}
                        >
                          Menneet hakemukset
                        </Link>
                      )}
                    </MenuItem>
                  </div>
                </MenuItems>
              </Transition>
            </Menu>
          </div>
        </div>
        {/* oikean reunan painikkeet */}
        <div className="flex items-center space-x-3">
          {isAuthenticated ? (
            <Link
              to="/"
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

import { Link } from "@tanstack/react-router";

export default function PageNotFoundComponent() {
  return (
    <main className="grid min-h-full place-items-center bg-gray-100 px-6 py-24 sm:py-32 lg:px-8">
      <div className="text-center">
        <p className="text-base font-semibold text-gray-400">404</p>
        <h1 className="mt-4 text-5xl font-semibold tracking-tight text-balance text-black sm:text-7xl">
          Sivua ei löytynyt
        </h1>
        <p className="mt-6 text-lg font-medium text-pretty text-gray-400 sm:text-xl/8">
          Pahoittelut, emme löytäneet sivua jota yritit hakea.
        </p>
        <div className="mt-10 flex items-center justify-center gap-x-6">
          <Link
            to="/"
            className="rounded-md bg-green-500 px-3.5 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-white hover:text-green-500"
          >
            Takaisin etusivulle
          </Link>
          <Link
            to="/"
            className="rounded-md bg-gray-300 px-3.5 py-2.5 text-sm font-semibold text-black shadow-xs hover:bg-white "
          >
            Takaisin etusivulle
          </Link>
        </div>
      </div>
    </main>
  );
}

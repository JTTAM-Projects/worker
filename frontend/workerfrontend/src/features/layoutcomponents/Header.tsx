export default function Header() {
  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      {/* navigaatio */}
      <nav className="container mx-auto px-6 py-3 flex justify-between items-center">
        {/* navigaatio-linkit (vasen) */}
        <div className="hidden md:flex items-center space-x-8">
          <a href="#" className="text-gray-600 hover:text-green-400">
            Miten toimii
          </a>
          <a href="#" className="text-gray-600 hover:text-green-400">
            Luo tehtävä
          </a>
          <a href="#" className="text-gray-600 hover:text-green-400">
            Selaa tehtäviä
          </a>
        </div>
        {/* oikean reunan painikkeet */}
        <div className="flex items-center space-x-4">
          <a
            href="#"
            className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 hover:border-green-400 text-sm font-medium"
          >
            Rekisteröidy
          </a>
          <a
            href="#"
            className="border border-gray-300 px-4 py-2 rounded-md hover:bg-gray-100 hover:border-green-400 text-sm font-medium"
          >
            Kirjaudu sisään
          </a>
          <button className="p-2 rounded-md hover:bg-gray-100">
            <span className="material-icons">menu</span>
          </button>
        </div>
      </nav>
    </header>
  );
}

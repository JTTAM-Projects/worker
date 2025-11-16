export default function Footer() {
  return (
    <footer className="bg-gray-100 border-t border-gray-200">
      <div className="container mx-auto px-6 py-4 text-sm text-gray-600">
        {/* alatunnisteen sisältö */}
        <div className="flex flex-col md:flex-row justify-between items-center">
          {/* linkit */}
          <div className="flex space-x-6 mb-4 md:mb-0">
            <a href="#" className="hover:text-green-400">
              Tietoa meistä
            </a>
            <a href="#" className="hover:text-green-400">
              Yhteystiedot
            </a>
            <a href="#" className="hover:text-green-400">
              Käyttöehdot
            </a>
            <a href="#" className="hover:text-green-400">
              Tietosuojakäytäntö
            </a>
          </div>
          {/* tekijänoikeusteksti */}
          <div>
            <p>© 2025 WorkerApp. Kaikki oikeudet pidätetään.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}

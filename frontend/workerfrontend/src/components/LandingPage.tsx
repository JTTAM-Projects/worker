import React, { useMemo, useState } from "react";

export default function LandingPage() {
  /* ======================== DATA JA TILA ======================== */
  /* ----- demo-data suodatusta varten ----- */
  const tehtavat = [
    {
      id: "t1",
      otsikko: "Keittiön siivous",
      kategoria: "cleaning",
      hinta: "35 €",
      sijainti: "Espoo",
      pvm: "15.9.",
    },
    {
      id: "t2",
      otsikko: "Pihan haravointi",
      kategoria: "garden",
      hinta: "40 €",
      sijainti: "Helsinki",
      pvm: "16.9.",
    },
    {
      id: "t3",
      otsikko: "Tietokoneen nopeutus",
      kategoria: "tech",
      hinta: "45 €",
      sijainti: "Vantaa",
      pvm: "16.9.",
    },
    {
      id: "t4",
      otsikko: "Koiran ulkoilutus",
      kategoria: "pets",
      hinta: "15 €",
      sijainti: "Espoo",
      pvm: "15.9.",
    },
    {
      id: "t5",
      otsikko: "Auton sisäpuhdistus",
      kategoria: "vehicles",
      hinta: "40 €",
      sijainti: "Kauniainen",
      pvm: "17.9.",
    },
  ] as const;

  /* ----- valittu kategoria (Popular Tasks -napit) ----- */
  const [kategoria, setKategoria] = useState<
    "cleaning" | "garden" | "tech" | "pets" | "vehicles" | "all"
  >("all");

  /* ----- suodatetut tehtävät bannerin listaan ----- */
  const suodatetut = useMemo(
    () =>
      tehtavat.filter((t) => kategoria === "all" || t.kategoria === kategoria),
    [kategoria]
  );

  /* ======================== SIVU ======================== */
  return (
    // pääkontti
    <section className="bg-gray-50 min-h-screen w-full">
      {/* ========== YLÄTUNNISTE / NAV ========== */}
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

      {/* ========== SISÄLTÖ (MAIN) ========== */}
      <main className="container mx-auto px-6 py-12 grid gap-12">
        {/* ---------- HERO / BANNERI ---------- */}
        <section className="bg-white rounded-lg shadow-lg text-center py-16 px-8">
          {/* otsikko */}
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800">
            Saa enemmän aikaan WorkerAppilla!
          </h1>
          {/* kuvausteksti */}
          <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
            Löydä luotettavia tekijöitä arjen tehtäviin, pienistä korjauksista
            päivittäisten asioiden hoitamiseen. Luo tehtävä ja aloita heti.
          </p>
          {/* CTA-painikkeet */}
          <div className="mt-8 flex justify-center space-x-4 flex-wrap">
            <a
              href="#"
              className="bg-green-500 text-white px-6 py-3 rounded-md hover:bg-green-600 font-medium"
            >
              Luo tehtävä
            </a>
            <a
              href="#"
              className="bg-white border border-gray-300 px-6 py-3 rounded-md hover:bg-gray-100 hover:border-green-400 font-medium"
            >
              Selaa tehtäviä
            </a>
          </div>
        </section>

        {/* --------------- KAKSI KORTTIA --------------- */}
        <section className="grid gap-8">
          <div className="grid md:grid-cols-2 gap-8">
            {/* kortti: työnantajalle */}
            <div className="bg-white p-6 rounded-lg border border-gray-200 hover:bg-gray-100 hover:border-green-400 hover:shadow-md transition duration-200 h-96 flex flex-col items-center justify-center text-center">
              <span className="material-icons text-green-400 text-4xl mb-4">
                work
              </span>
              <h3 className="font-bold text-2xl text-gray-800 mb-4">
                Työnantajalle
              </h3>
              <p className="text-gray-600 max-w-xs mb-6">
                Luo tehtäviä ja löydä sopivat tekijät nopeasti ja turvallisesti.
              </p>
              <button className="bg-green-500 text-white px-6 py-3 rounded-md font-medium hover:bg-green-600">
                Luo tehtävä
              </button>
            </div>

            {/* kortti: työntekijälle */}
            <div className="bg-white p-6 rounded-lg border border-gray-200 hover:bg-gray-100 hover:border-green-400 hover:shadow-md transition duration-200 h-96 flex flex-col items-center justify-center text-center">
              <span className="material-icons text-green-400 text-4xl mb-4">
                person
              </span>
              <h3 className="font-bold text-2xl text-gray-800 mb-4">
                Työntekijälle
              </h3>
              <p className="text-gray-600 max-w-xs mb-6">
                Selaa avoimia tehtäviä ja ansaitse rahaa omilla taidoillasi.
              </p>
              <button className="bg-green-500 text-white px-6 py-3 rounded-md font-medium hover:bg-green-600">
                Hae tehtäviä
              </button>
            </div>
          </div>
        </section>

        {/* ---------- POPULAR TASKS (filtterinapit) ---------- */}
        <section className="grid gap-6">
          {/* otsikko */}
          <h2 className="text-2xl font-bold text-gray-800">
            Suosittuja tehtäviä
          </h2>

          {/* painikelista -> suodattaa bannerin listaa */}
          <div className="flex flex-wrap gap-4">
            {[
              {
                id: "cleaning",
                icon: "cleaning_services",
                label: "Siivous",
              },
              { id: "garden", icon: "local_florist", label: "Puutarhatyöt" },
              { id: "tech", icon: "support_agent", label: "Tekninen apu" },
              { id: "pets", icon: "pets", label: "Lemmikkien hoito" },
              { id: "vehicles", icon: "local_car_wash", label: "Auton pesu" },
              { id: "all", icon: "filter_list", label: "Kaikki" },
            ].map(({ id, icon, label }) => {
              const active = kategoria === id;
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() =>
                    setKategoria(
                      id as
                        | "cleaning"
                        | "garden"
                        | "tech"
                        | "pets"
                        | "vehicles"
                        | "all"
                    )
                  }
                  className={`flex items-center bg-white border rounded-lg px-4 py-3 transition
            ${
              active
                ? "border-green-400"
                : "border-gray-300 hover:bg-gray-100 hover:border-green-400"
            }`}
                >
                  <span className="material-icons mr-2 text-green-400">
                    {icon}
                  </span>
                  <span className="font-medium text-gray-800">{label}</span>
                </button>
              );
            })}
          </div>
        </section>

        {/* ---------- BANNERIIN LISTA (suodatettu) ---------- */}
        <section className="bg-white rounded-lg shadow-lg p-6 md:p-8">
          {/* listaus laatikossa */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {suodatetut.map((t) => (
              <div
                key={t.id}
                className="bg-white rounded-lg border border-gray-200 p-5 hover:bg-gray-100 hover:border-green-400 transition"
              >
                {/* otsikko + hinta */}
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-gray-800">{t.otsikko}</h4>
                  <span className="text-gray-700 font-medium">{t.hinta}</span>
                </div>
                {/* sijainti + päivämäärä */}
                <div className="text-sm text-gray-600 flex items-center gap-4">
                  <span className="flex items-center">
                    <span className="material-icons mr-1 text-green-400">
                      place
                    </span>
                    {t.sijainti}
                  </span>
                  <span className="flex items-center">
                    <span className="material-icons mr-1 text-green-400">
                      event
                    </span>
                    {t.pvm}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* ========== ALATUNNISTE ========== */}
      <footer className="bg-gray-100 border-t border-gray-200">
        <div className="container mx-auto px-6 py-6 text-sm text-gray-600">
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
    </section>
  );
}

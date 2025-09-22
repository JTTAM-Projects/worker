import { useMemo, useState } from "react";
import Footer from "../features/layoutcomponents/Footer";
import Header from "../features/layoutcomponents/Header";
import EmployerPromoCard from "../features/employer/components/EmployerPromoCard";
import TaskFilter from "../features/task/components/TaskFilter";
import TaskList from "../features/task/components/TaskList";
import TaskerPromoCard from "../features/task/components/TaskerPromoCard";

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
      <Header />

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
            <EmployerPromoCard />
            <TaskerPromoCard />
          </div>
        </section>

        <TaskFilter kategoria={kategoria} setKategoria={setKategoria} />

        <TaskList tasks={suodatetut} />
      </main>

      <Footer />
    </section>
  );
}

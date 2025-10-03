import { useMemo, useState } from "react";
import EmployerPromoCard from "../features/employer/components/EmployerPromoCard";
import TaskFilter from "../features/task/components/TaskFilter";
import TaskList from "../features/task/components/TaskList";
import TaskerPromoCard from "../features/task/components/TaskerPromoCard";
import type { Category } from "../features/task/types";
import { Link } from "react-router-dom";

export default function LandingPage() {
  /* ======================== DATA AND STATE ======================== */
  /* ----- demo data for filtering ----- */
  const tasks = [
    {
      id: "t1",
      title: "Keittiön siivous",
      category: "cleaning",
      price: "35 €",
      location: "Espoo",
      date: "15.9.",
    },
    {
      id: "t2",
      title: "Pihan haravointi",
      category: "garden",
      price: "40 €",
      location: "Helsinki",
      date: "16.9.",
    },
    {
      id: "t3",
      title: "Tietokoneen nopeutus",
      category: "tech",
      price: "45 €",
      location: "Vantaa",
      date: "16.9.",
    },
    {
      id: "t4",
      title: "Koiran ulkoilutus",
      category: "pets",
      price: "15 €",
      location: "Espoo",
      date: "15.9.",
    },
    {
      id: "t5",
      title: "Auton sisäpuhdistus",
      category: "vehicles",
      price: "40 €",
      location: "Kauniainen",
      date: "17.9.",
    },
  ] as const;

  /* ----- selected category (Popular Tasks buttons) ----- */
  const [category, setCategory] = useState<Category>("all");

  /* ----- filtered tasks for the banner list ----- */
  const filteredTasks = useMemo(
    () => tasks.filter((t) => category === "all" || t.category === category),
    [category]
  );

  /* ======================== PAGE ======================== */
  return (
    <main className="container mx-auto px-6 py-12 grid gap-12">
      {/* ---------- HERO / BANNER ---------- */}
      <section className="bg-white rounded-lg shadow-lg text-center py-16 px-8">
        {/* title */}
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
          <Link
            to="/tasks/create"
            className="bg-green-500 text-white px-6 py-3 rounded-md hover:bg-green-600 font-medium"
          >
            Luo tehtävä
          </Link>
          <Link
            to="/tasks"
            className="bg-white border border-gray-300 px-6 py-3 rounded-md hover:bg-gray-100 hover:border-green-400 font-medium"
          >
            Selaa tehtäviä
          </Link>
        </div>
      </section>

      {/* --------------- TWO CARDS --------------- */}
      <section className="grid gap-8">
        <div className="grid md:grid-cols-2 gap-8">
          <EmployerPromoCard />
          <TaskerPromoCard />
        </div>
      </section>

      <TaskFilter category={category} setCategory={setCategory} />

      <TaskList tasks={filteredTasks} />
    </main>
  );
}

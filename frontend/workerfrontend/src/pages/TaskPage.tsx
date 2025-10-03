import { useMemo, useState } from "react";
import SearchBar from "../features/task/components/SearchBar";
import TaskFilter from "../features/task/components/TaskFilter";
import TaskList from "../features/task/components/TaskList";
import type { Category } from "../features/task/types";

export default function TaskPage() {
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

  const [category, setCategory] = useState<Category>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredTasks = useMemo(() => {
    return tasks.filter((t) => {
      const isCategoryMatch = category === "all" || t.category === category;
      const isSearchMatch = t.title
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      return isCategoryMatch && isSearchMatch;
    });
  }, [category, searchQuery]);

  return (
    <main className="container mx-auto px-6 py-12 grid gap-12 pt-10 pb-20">
      <section className="grid gap-12">
        <h1 className="text-4xl font-bold text-gray-800">Selaa tehtäviä</h1>
        <div className="grid gap-4">
          <SearchBar
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />
          <TaskFilter category={category} setCategory={setCategory} />
        </div>
      </section>

      <TaskList tasks={filteredTasks} />
    </main>
  );
}

import { useMemo, useState } from "react";
import SearchBar from "../features/task/components/SearchBar";
import TaskFilter from "../features/task/components/TaskFilter";
import TaskList from "../features/task/components/TaskList";
import type { Category } from "../features/task/types";
import { useTasks } from "../features/task/hooks/useTasks";

export default function TaskPage() {
  const [category, setCategory] = useState<Category | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(0);

  const { data, isLoading, isError, error } = useTasks({
    page,
    size: 12,
    category: category !== "all" ? category : undefined,
    status: "ACTIVE",
  });

  // Client-side search filtering (backend doesn't support search yet)
  const filteredTasks = useMemo(() => {
    if (!data?.content) return [];

    if (!searchQuery) return data.content;

    return data.content.filter((task) =>
      task.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [data?.content, searchQuery]);

  if (isLoading) {
    return (
      <main className="container mx-auto px-6 py-12 grid gap-12 pt-10 pb-20">
        <div className="text-center text-gray-600">Ladataan tehtäviä...</div>
      </main>
    );
  }

  if (isError) {
    return (
      <main className="container mx-auto px-6 py-12 grid gap-12 pt-10 pb-20">
        <div className="text-center text-red-600">
          Virhe ladattaessa tehtäviä: {error.message}
        </div>
      </main>
    );
  }

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

      {data && (
        <div className="flex justify-center items-center gap-4">
          <button
            onClick={() => setPage(page - 1)}
            disabled={page === 0}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            Edellinen
          </button>
          <span className="text-gray-700">
            Sivu {page + 1} / {data.totalPages}
          </span>
          <button
            onClick={() => setPage(page + 1)}
            disabled={page >= data.totalPages - 1}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            Seuraava
          </button>
        </div>
      )}
    </main>
  );
}

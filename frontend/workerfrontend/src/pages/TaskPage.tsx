import { useMemo, useState } from "react";
import SearchBar from "../features/task/components/SearchBar";
import TaskFilter from "../features/task/components/TaskFilter";
import TaskList from "../features/task/components/TaskList";
import type { Category } from "../features/task/types";
import { useTasks } from "../features/task/hooks/useTasks";
import { Pagination } from "../ui-library";

export default function TaskPage() {
  const [category, setCategory] = useState<Category | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(0);

  const { data, isLoading, isError, error } = useTasks({
    page,
    size: 12,
    category: category !== "all" ? category : undefined,
    status: "Active",
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
        <Pagination
          currentPage={page}
          totalPages={data.totalPages}
          onPageChange={(newPage) => setPage(newPage)}
          onPrevious={() => setPage(page - 1)}
          onNext={() => setPage(page + 1)}
          zeroIndexed={true}
        />
      )}
    </main>
  );
}

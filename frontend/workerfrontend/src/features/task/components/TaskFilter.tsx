import type { Category } from "../types";

interface TaskFilterProps {
  category: Category | "all";
  setCategory: (category: Category | "all") => void;
}

export default function TaskFilter({ category, setCategory }: TaskFilterProps) {
  const filterOptions = [
    { id: "Cleaning" as const, icon: "cleaning_services", label: "Siivous" },
    { id: "Garden" as const, icon: "local_florist", label: "Puutarhatyöt" },
    { id: "Moving" as const, icon: "local_shipping", label: "Muuttoapu" },
    { id: "Other" as const, icon: "help_outline", label: "Muu" },
    { id: "all" as const, icon: "filter_list", label: "Kaikki" },
  ] as const;

  return (
    <section className="grid gap-6">
      <h2 className="text-2xl font-bold text-gray-800">Suosittuja kategorioita</h2>
      <div className="flex flex-wrap gap-4">
        {filterOptions.map(({ id, icon, label }) => {
          const active = category === id;
          return (
            <button
              key={id}
              type="button"
              onClick={() => setCategory(id)}
              className={`flex items-center bg-white border rounded-lg px-4 py-3 transition
                ${active ? "border-green-400" : "border-gray-300 hover:bg-gray-100 hover:border-green-400"}`}
            >
              <span className="material-icons mr-2 text-green-400">{icon}</span>
              <span className="font-medium text-gray-800">{label}</span>
            </button>
          );
        })}
      </div>
    </section>
  );
}

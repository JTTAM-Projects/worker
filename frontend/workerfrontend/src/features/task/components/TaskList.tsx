import type { Task } from "../types";

interface TaskListProps {
  tasks: Task[];
}

export default function TaskList({ tasks }: TaskListProps) {
  const formatDate = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleDateString("fi-FI", {
      day: "numeric",
      month: "numeric",
    });
  };

  return (
    <section className="bg-white rounded-lg shadow-lg p-6 md:p-8">
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tasks.map((t) => (
          <div
            key={t.id}
            className="bg-white rounded-lg border border-gray-200 p-5 hover:bg-gray-100 hover:border-green-400 transition"
          >
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-semibold text-gray-800">{t.title}</h4>
              <span className="text-gray-700 font-medium">{t.price} €</span>
            </div>
            <div className="text-sm text-gray-600 flex items-center gap-4">
              <span className="flex items-center">
                <span className="material-icons mr-1 text-green-400">
                  place
                </span>
                {t.location}
              </span>
              <span className="flex items-center">
                <span className="material-icons mr-1 text-green-400">
                  event
                </span>
                {formatDate(t.startDate)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

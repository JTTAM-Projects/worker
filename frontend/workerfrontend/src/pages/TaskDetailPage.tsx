import { useParams, useNavigate } from "react-router-dom";
import { useTaskById } from "../features/task/hooks/useTaskById";
import TaskDetails from "../features/task/components/TaskDetails";

export default function TaskDetailPage() {
  const { taskId } = useParams<{ taskId: string }>();
  const navigate = useNavigate();
  const { data: task, isLoading, isError, error } = useTaskById(Number(taskId));

  const getCategoryIcon = (categoryTitle: string) => {
    switch (categoryTitle?.toUpperCase()) {
      case "GARDEN":
        return "yard";
      case "CLEANING":
        return "cleaning_services";
      case "MOVING":
        return "local_shipping";
      case "OTHER":
        return "handyman";
      case "YARD":
        return "grass";
      case "FOREST WORK":
        return "forest";
      case "HOUSEHOLD":
        return "home";
      case "REPAIR":
        return "build";
      case "PAINTING":
        return "format_paint";
      case "SNOW REMOVAL":
        return "ac_unit";
      default:
        return "work";
    }
  };

  if (isLoading) {
    return (
      <main className="container mx-auto px-6 py-12">
        <div className="text-center text-gray-600">Ladataan tehtävää...</div>
      </main>
    );
  }

  if (isError || !task) {
    return (
      <main className="container mx-auto px-6 py-12">
        <div className="text-center text-red-600">
          Virhe ladattaessa tehtävää: {error?.message || "Tehtävää ei löytynyt"}
        </div>
        <div className="text-center mt-4">
          <button
            onClick={() => navigate("/tasks")}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Palaa tehtäviin
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="max-w-7xl mx-auto px-6 py-12">
      <button
        onClick={() => navigate("/tasks")}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-6"
      >
        <span className="material-icons">arrow_back</span>
        Takaisin tehtäviin
      </button>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="bg-white border-b p-8">
          <h1 className="text-3xl font-bold text-gray-900">{task.title}</h1>
        </div>

        <div className="p-8">
          <TaskDetails
            task={task}
            description={task.description}
            categories={task.categories}
            getCategoryIcon={getCategoryIcon}
          />

          <div className="flex justify-end mt-6">
            <button className="w-full md:w-[320px] px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2">
              <span className="material-icons">check_circle</span>
              Hae työhön
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}

import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useTaskById } from "../features/task/hooks/useTaskById";
import { useUserApplication } from "../features/task/hooks/useUserApplication";
import TaskDetails from "../features/task/components/TaskDetails";
import ApplicationsList from "../features/task/components/ApplicationsList";
import ApplicationForm from "../features/task/components/ApplicationForm";

export default function TaskDetailPage() {
  const { taskId } = useParams<{ taskId: string }>();
  const navigate = useNavigate();
  const { isAuthenticated, loginWithRedirect } = useAuth0();
  const { data: task, isLoading, isError } = useTaskById(Number(taskId));
  const { data: hasApplied, isLoading: checkingApplication } =
    useUserApplication(Number(taskId));
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleApplicationSuccess = () => {
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 10000);
    setShowApplicationForm(false);
  };

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

  const handleApplyClick = () => {
    if (!isAuthenticated) {
      loginWithRedirect();
    } else {
      setShowApplicationForm(!showApplicationForm);
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
          Virhe ladattaessa tehtävää: {"Tehtävää ei löytynyt"}
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
            {isAuthenticated && hasApplied ? (
              <div className="w-full md:w-[320px] px-6 py-3 bg-gray-200 text-gray-600 font-semibold rounded-lg flex items-center justify-center gap-2 cursor-not-allowed">
                <span className="material-icons">check</span>
                Olet jo hakenut tähän työhön
              </div>
            ) : (
              <button
                onClick={handleApplyClick}
                disabled={checkingApplication}
                className="w-full md:w-[320px] px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="material-icons">
                  {showApplicationForm ? "close" : "check_circle"}
                </span>
                {checkingApplication
                  ? "Tarkistetaan..."
                  : showApplicationForm
                  ? "Sulje lomake"
                  : "Hae työhön"}
              </button>
            )}
          </div>

          {showSuccess && (
            <div className="mt-6 bg-green-50 border border-green-200 text-green-800 px-4 py-4 rounded-lg flex items-center gap-3">
              <span className="material-icons text-green-600 text-2xl">
                check_circle
              </span>
              <div>
                <p className="font-semibold">
                  Hakemus lähetetty onnistuneesti!
                </p>
              </div>
            </div>
          )}

          {showApplicationForm && isAuthenticated && (
            <ApplicationForm
              taskId={Number(taskId)}
              taskPrice={task.price}
              onSuccess={handleApplicationSuccess}
              onCancel={() => setShowApplicationForm(false)}
            />
          )}
        </div>
      </div>

      <div className="mt-8">
        <ApplicationsList taskId={task.id} />
      </div>
    </main>
  );
}

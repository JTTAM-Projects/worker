import { useRef, useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { useTaskById } from "../features/task/hooks/useTaskById";
import { getCategoryIcon } from "../features/task/utils/categoryUtils";
import ApplicationsList from "../features/task/components/ApplicationsList";
import TaskDetails from "../features/task/components/TaskDetails";
import { useUpdateApplicationStatus } from "../features/task/hooks";

// Page for viewing and managing own task details
export default function OwnTaskDetailPage() {
  const navigate = useNavigate();
  const { taskId } = useParams<{ taskId: string }>();
  const numericTaskId = taskId ? Number(taskId) : NaN;
  const { data: task, isLoading, isError } = useTaskById(numericTaskId);
  const updateApplicationStatus = useUpdateApplicationStatus();

  // Close modal and show success message when application status is updated successfully
  useEffect(() => {
    if (updateApplicationStatus.isSuccess) {
      setSelectedApplication(null);
      setSuccessMessage("Hakemus hylätty onnistuneesti!");
      // Clear message after 3 seconds
      setTimeout(() => setSuccessMessage(""), 3000);
    }
  }, [updateApplicationStatus.isSuccess]);
  const [activeTab, setActiveTab] = useState("information");
  const [selectedApplication, setSelectedApplication] = useState<any>(null);
  const [successMessage, setSuccessMessage] = useState<string>("");
  const {
    isAuthenticated,
    loginWithRedirect,
    isLoading: authLoading,
  } = useAuth0();
  const loginAttemptedRef = useRef(false);

  useEffect(() => {
    if (!authLoading && !isAuthenticated && !loginAttemptedRef.current) {
      loginAttemptedRef.current = true;
      void loginWithRedirect({
        appState: { returnTo: `/my-tasks/${taskId ?? ""}` },
      });
    }

    if (isAuthenticated) {
      loginAttemptedRef.current = false;
    }
  }, [authLoading, isAuthenticated, loginWithRedirect, taskId]);

  if (authLoading || !isAuthenticated) {
    return (
      <main className="container mx-auto px-6 py-12">
        <div className="text-center text-gray-600">
          {authLoading
            ? "Tarkistetaan kirjautumista..."
            : "Uudelleenohjataan kirjautumiseen..."}
        </div>
      </main>
    );
  }

  if (Number.isNaN(numericTaskId)) {
    return (
      <main className="container mx-auto px-6 py-12">
        <div className="text-center text-red-600">
          Virheellinen tehtävän tunniste.
        </div>
        <div className="text-center mt-4">
          <button
            onClick={() => navigate("/my-tasks")}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Palaa omiin työilmoituksiin
          </button>
        </div>
      </main>
    );
  }

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
            onClick={() => navigate("/my-tasks")}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Palaa omiin työilmoituksiin
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="max-w-7xl mx-auto px-6 py-12">
      {successMessage && (
        <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
          {successMessage}
        </div>
      )}

      <button
        onClick={() => navigate("/my-tasks")}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-6"
      >
        <span className="material-icons">arrow_back</span>
        Takaisin omiin työilmoituksiin
      </button>

      <div className="flex mb-6 border-b">
        <button
          className={`py-2 px-4 text-sm font-medium ${
            activeTab === "information"
              ? "text-green-600 border-b-2 border-green-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
          onClick={() => setActiveTab("information")}
        >
          Tiedot
        </button>
        <button
          className={`py-2 px-4 text-sm font-medium ${
            activeTab === "applications"
              ? "text-green-600 border-b-2 border-green-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
          onClick={() => setActiveTab("applications")}
        >
          Hakemukset
        </button>
      </div>

      {task && (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="bg-white border-b p-8">
            <h1 className="text-3xl font-bold text-gray-900">{task.title}</h1>
          </div>
          <div className="p-8">
            {activeTab === "information" ? (
              <>
                <TaskDetails
                  task={task}
                  description={task.description}
                  categories={task.categories}
                  getCategoryIcon={getCategoryIcon}
                />
                <div className="mt-6 flex gap-4 justify-end">
                  <button
                    onClick={() => {
                      if (authLoading) {
                        return;
                      }
                      if (!isAuthenticated) {
                        void loginWithRedirect({
                          appState: { returnTo: `/edit-task/${task.id}` },
                        });
                        return;
                      }
                      navigate(`/edit-task/${task.id}`);
                    }}
                    className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 border border-gray-300"
                  >
                    Muokkaa
                  </button>
                  <button className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
                    Poista
                  </button>
                </div>
              </>
            ) : (
              <>
                <ApplicationsList
                  taskId={task.id}
                  onSelect={setSelectedApplication}
                />
                {selectedApplication && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                    <div className="bg-white rounded-lg w-full max-w-xl p-6 mx-4">
                      <div className="flex items-start justify-between">
                        <h3 className="text-lg font-semibold">
                          Hakemuksen tiedot
                        </h3>
                        <button
                          onClick={() => setSelectedApplication(null)}
                          className="text-gray-500 hover:text-gray-700"
                          aria-label="Sulje"
                        >
                          <span className="material-icons">close</span>
                        </button>
                      </div>

                      <div className="mt-4 space-y-3">
                        <div className="flex items-center gap-4">
                          {selectedApplication.user?.profileImageUrl ? (
                            <img
                            // Photo when available
                            />
                          ) : (
                            <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                              <span className="material-icons text-gray-600">
                                person
                              </span>
                            </div>
                          )}

                          <div>
                            <div className="text-xs text-gray-500">Hakija</div>
                            <div className="font-medium text-gray-900">
                              {selectedApplication.user?.userName}
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              {typeof selectedApplication.user
                                ?.averageRating === "number" ? (
                                <>
                                  <span className="material-icons text-yellow-500 text-base">
                                    star
                                  </span>
                                  <span>
                                    {selectedApplication.user.averageRating.toFixed(
                                      1
                                    )}
                                  </span>
                                </>
                              ) : (
                                <span className="text-gray-500">
                                  Ei arvosteluja
                                </span>
                              )}
                            </div>
                          </div>

                          <div className="ml-auto text-sm">
                            {selectedApplication.applicationStatus ===
                            "PENDING" ? (
                              <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700 border border-green-300">
                                Active
                              </span>
                            ) : selectedApplication.applicationStatus ===
                              "ACCEPTED" ? (
                              <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700 border border-blue-300">
                                Hyväksytty
                              </span>
                            ) : selectedApplication.applicationStatus ===
                              "REJECTED" ? (
                              <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700 border border-red-300">
                                Hylätty
                              </span>
                            ) : (
                              <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700 border border-gray-300">
                                {selectedApplication.applicationStatus}
                              </span>
                            )}
                          </div>
                        </div>

                        <div>
                          <div className="text-xs text-gray-500">
                            Hintaehdotus
                          </div>
                          <div className="font-medium text-green-600 text-lg">
                            {selectedApplication.priceSuggestion} €
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <div className="text-xs text-gray-500">
                              Aikaehdotus
                            </div>
                            <div className="text-gray-900">
                              <div className="font-medium">
                                {new Date(selectedApplication.timeSuggestion)
                                  .toLocaleDateString("fi-FI", {
                                    weekday: "long",
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                  })
                                  .replace(/^./, (c) => c.toUpperCase())}
                              </div>
                            </div>
                          </div>

                          <div>
                            <div className="text-xs text-gray-500">
                              Kellonaika
                            </div>
                            <div className="text-gray-900">
                              <div className="text-sm font-medium">
                                {new Date(
                                  selectedApplication.timeSuggestion
                                ).toLocaleTimeString("fi-FI", {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </div>
                            </div>
                          </div>
                        </div>

                        <div>
                          <div className="text-xs text-gray-500">Viesti</div>
                          <div className="text-gray-900 whitespace-pre-line">
                            {selectedApplication.description ? (
                              selectedApplication.description
                            ) : (
                              <span className="text-gray-700">
                                Ei lisätietoja
                              </span>
                            )}
                          </div>
                        </div>

                        <div>
                          <div className="text-xs text-gray-500">
                            Hakemus jätetty
                          </div>
                          <div className="text-gray-700">
                            {new Date(
                              selectedApplication.createdAt
                            ).toLocaleDateString("fi-FI")}
                          </div>
                        </div>
                      </div>

                      <div className="mt-6 flex items-center justify-between pt-8 border-t border-gray-200">
                        <div>
                          <button
                            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                            onClick={() => {
                              if (selectedApplication && task) {
                                console.log("Rejecting application:", {
                                  taskId: task.id,
                                  applicantUsername:
                                    selectedApplication.user.userName,
                                  applicationStatus:
                                    selectedApplication.applicationStatus,
                                });
                                if (
                                  selectedApplication.applicationStatus !==
                                  "PENDING"
                                ) {
                                  console.error(
                                    "Application is not pending:",
                                    selectedApplication.applicationStatus
                                  );
                                  return;
                                }
                                updateApplicationStatus.mutate({
                                  taskId: task.id,
                                  applicantUsername:
                                    selectedApplication.user.userName,
                                  status: "REJECTED",
                                });
                              }
                            }}
                          >
                            Hylkää
                          </button>
                        </div>

                        <div>
                          <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                            Hyväksy
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </main>
  );
}

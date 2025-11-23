import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { applicationQueries } from "../../../../../features/application/queries/applicationQueries";
import { useAuth } from "../../../../../auth/useAuth";
import type { ApplicationWithDetails } from "../../../../../features/application/types";

export const Route = createFileRoute("/_authenticated/worker/own-tasks/to-do/")({
  component: RouteComponent,
  loader: ({ context }) =>
    context.queryClient.ensureQueryData(
      applicationQueries.ownApplications(context.auth.getAccessToken, {
        page: 0,
        size: 10,
        applicationStatus: "ACCEPTED",
      })
    ),
});

function RouteComponent() {
  const navigate = useNavigate();
  const { getAccessTokenSilently } = useAuth();
  const { data } = useSuspenseQuery(
    applicationQueries.ownApplications(getAccessTokenSilently, { page: 0, size: 10, applicationStatus: "ACCEPTED" })
  );

  const applications: ApplicationWithDetails[] = data?.content ?? [];

  return (
    <main className="max-w-5xl mx-auto px-6 py-12 space-y-8">
      <header className="flex flex-col gap-2">
        <p className="text-sm text-gray-500 uppercase tracking-wide">Omat tehtävät</p>
        <h1 className="text-3xl font-bold text-gray-900">Toteutettavat työt</h1>
        <p className="text-gray-600">Näet tässä tehtävät, joiden hakemus on hyväksytty. Aloita työ ja etene kolmevaiheisessa prosessissa.</p>
      </header>

      <section className="space-y-4">
        {applications.length === 0 && (
          <div className="rounded-xl border border-dashed border-gray-300 bg-white p-10 text-center text-gray-500">
            Sinulla ei ole hyväksyttyjä tehtäviä juuri nyt. Hae tehtäviin ja palaa tänne, kun hakemuksesi on hyväksytty.
          </div>
        )}

        {applications.map((application) => {
          const task = application.task;
          const taskId = task?.id;

          if (!taskId) {
            return null;
          }

          return (
            <article
              key={`${taskId}-${application.user?.userName ?? "me"}`}
              className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
            >
              <div>
                <p className="text-xs uppercase text-gray-500 tracking-wide">Työ #{taskId}</p>
                <h2 className="text-2xl font-semibold text-gray-900">{task?.title ?? application.taskTitle}</h2>
                <p className="text-gray-600 mt-2 line-clamp-2">{task?.description || application.description || "Ei kuvausta"}</p>
              </div>

              <div className="flex flex-col items-start gap-3 md:items-end">
                <div className="text-gray-500 text-sm">
                  {task?.startDate ? new Date(task.startDate).toLocaleDateString("fi-FI") : "-"} –{" "}
                  {task?.endDate ? new Date(task.endDate).toLocaleDateString("fi-FI") : "-"}
                </div>
                <button
                  type="button"
                  onClick={() =>
                    navigate({
                      to: "/worker/own-tasks/to-do/$taskId",
                      params: { taskId: taskId.toString() },
                    })
                  }
                  className="rounded-lg bg-green-500 px-5 py-2 text-sm font-semibold text-white hover:bg-green-600"
                >
                  Aloita toteutus
                </button>
              </div>
            </article>
          );
        })}
      </section>
    </main>
  );
}

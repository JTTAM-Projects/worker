import { useAuth0 } from "@auth0/auth0-react";
import ProfileAboutSection from "../features/Profile/ProfileAboutSection";
import ProfileSkillsSection from "../features/Profile/UserSkillsSection";
import UserProfileCard from "../features/Profile/UserProfileCard";
import TaskList from "../features/task/components/TaskList";
import { useUserTasks } from "../features/task/hooks/useUserTasks";

export default function ProfilePage() {
  const { user } = useAuth0();
  const { data: userTasksData, isLoading, error } = useUserTasks();

  // Get user tasks from backend, filters only ACTIVE tasks
  const activeUserTasks = (userTasksData || []).filter(
    (task) => task.status === "ACTIVE"
  );

  return (
    <section className="bg-gray-50 min-h-screen w-full">
      <main className="container mx-auto px-6 py-12 grid gap-10">
        <UserProfileCard user={user} />
        <ProfileAboutSection />
        <ProfileSkillsSection />
        <h2 className="text-2xl font-bold text-gray-800">Yhteystiedot</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-sm font-medium text-gray-500">Sähköposti</h3>
            <p className="mt-1 text-gray-800">
              {user?.email || "Email not found"}
            </p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">Puhelinnumero</h3>
            <p className="mt-1 text-gray-800">123456</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">Sijainti</h3>
            <p className="mt-1 text-gray-800">Helsinki, FI</p>
          </div>
        </div>

        <section>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Omat työilmoitukset
          </h2>
          <p className="text-gray-600 mb-6">
            Tässä näet kaikki <span className="font-semibold">aktiiviset</span>{" "}
            työilmoituksesi, joihin etsit työntekijöitä.
          </p>

          {isLoading && (
            <div className="text-center py-8">
              <p className="text-gray-600">Ladataan tehtäviä...</p>
            </div>
          )}

          {error && (
            <div className="text-center py-8">
              <p className="text-red-600">
                Virhe tehtävien lataamisessa. Yritä uudelleen myöhemmin.
              </p>
            </div>
          )}

          {!isLoading && !error && <TaskList tasks={activeUserTasks} />}
        </section>
      </main>
    </section>
  );
}

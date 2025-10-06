import { useAuth0 } from "@auth0/auth0-react";
import ProfileAboutSection from "../features/Profile/components/ProfileAboutSection";
import ProfileSkillsSection from "../features/Profile/components/UserSkillsSection";
import UserProfileCard from "../features/Profile/components/UserProfileCard";
import TaskList from "../features/task/components/TaskList";
import { useUserTasks } from "../features/task/hooks/useUserTasks";
import UserProfileContactInfo from "../features/Profile/components/UserProfileContactInfo";

export default function ProfilePage() {
  const { user } = useAuth0();
  const { data: userTasksData, isLoading, error } = useUserTasks();
  
  // Get user tasks from backend, filters only ACTIVE tasks
  const activeUserTasks = (userTasksData || []).filter(
    (task) => task.status === "ACTIVE"
  );
  console.log("Test " + userTasksData);

  if (isLoading) {
      return <div>Loading ...</div>;
  }

  return (
    <section className="bg-gray-50 min-h-screen w-full">
      <main className="container mx-auto px-6 py-12 grid gap-10">
        <UserProfileCard user={user}/>
        <ProfileAboutSection />
        <ProfileSkillsSection />
        <h2 className="text-2xl font-bold text-gray-800">Yhteystiedot</h2>
        <UserProfileContactInfo user={user} />
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

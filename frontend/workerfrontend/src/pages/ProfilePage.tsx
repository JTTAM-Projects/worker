import { useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import UserProfileCard from "../features/Profile/components/shared/UserProfileCard";
import EmployerDetails from "../features/Profile/components/employer/EmployerDetails";
import TaskerDetails from "../features/Profile/components/tasker/TaskerDetails";

export default function ProfilePage() {
  const { user } = useAuth0();
  const [activeTab, setActiveTab] = useState("employer");
  return (
    <section className="bg-gray-50 min-h-screen w-full">
      <main className="container mx-auto px-6 py-12 grid gap-10">
        <UserProfileCard user={user} />
        <div className="flex mb-6 border-b">
          <button
            className={`py-2 px-4 text-sm font-medium ${
              activeTab === "employer"
                ? "text-green-600 border-b-2 border-green-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("employer")}
          >
            Yrittäjä profiili
          </button>
          <button
            className={`py-2 px-4 text-sm font-medium ${
              activeTab === "employee"
                ? "text-green-600 border-b-2 border-green-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("employee")}
          >
            Työntekijä profiili
          </button>
        </div>
        {activeTab === "employer" ? <EmployerDetails /> : <TaskerDetails />}
        <section>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Omat työilmoitukset</h2>
          <p className="text-gray-600 mb-6">
            Tässä näet kaikki <span className="font-semibold">aktiiviset</span> työilmoituksesi, joihin etsit
            työntekijöitä.
          </p>

          <div className="text-center py-8">
            <p className="text-gray-600">Ladataan tehtäviä...</p>
          </div>

          <div className="text-center py-8">
            <p className="text-red-600">Virhe tehtävien lataamisessa. Yritä uudelleen myöhemmin.</p>
          </div>
        </section>
      </main>
    </section>
  );
}

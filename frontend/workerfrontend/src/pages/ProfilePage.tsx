import { useAuth0 } from "@auth0/auth0-react";
import ProfileAboutSection from "../features/Profile/ProfileAboutSection";
import ProfileSkillsSection from "../features/Profile/UserSkillsSection";
import UserProfileCard from "../features/Profile/UserProfileCard";
import TaskList from "../features/task/components/TaskList";
import type { Task } from "../features/task/types";

export default function ProfilePage() {
  const { user, isLoading } = useAuth0();

  if (isLoading) {
    return <div>Loading ...</div>;
  }

  // Mock-työilmoitukset
  const omatTyot: Task[] = [
    {
      id: 1,
      title: "Varaston hyllyjen kokoaminen",
      category: "OTHER",
      price: 120,
      location: "Espoo",
      startDate: "2025-10-05T10:00:00",
      endDate: "2025-10-05T16:00:00",
      status: "ACTIVE",
      description: "Varaston hyllyt tarvitsevat kokoamista.",
      user: user
        ? {
            userName: user.name || "Unknown",
            mail: user.email || "unknown@example.com",
            businessId: "1234567-8",
            phoneNumber: "123456",
            address: "Espoo, FI",
          }
        : {
            userName: "Unknown",
            mail: "unknown@example.com",
            businessId: "1234567-8",
            phoneNumber: "123456",
            address: "Espoo, FI",
          },
    },
    {
      id: 2,
      title: "Pihan syyssiivous ja haravointi",
      category: "GARDEN",
      price: 80,
      location: "Helsinki",
      startDate: "2025-10-07T09:00:00",
      endDate: "2025-10-07T15:00:00",
      status: "ACTIVE",
      description: "Syksyn lehdet ja pihan siistiminen.",
      user: user
        ? {
            userName: user.name || "Unknown",
            mail: user.email || "unknown@example.com",
            businessId: "1234567-8",
            phoneNumber: "123456",
            address: "Helsinki, FI",
          }
        : {
            userName: "Unknown",
            mail: "unknown@example.com",
            businessId: "1234567-8",
            phoneNumber: "123456",
            address: "Helsinki, FI",
          },
    },
    {
      id: 3,
      title: "Tietokoneen perushuolto ja Windowsin optimointi",
      category: "OTHER",
      price: 70,
      location: "Vantaa",
      startDate: "2025-10-12T11:00:00",
      endDate: "2025-10-12T14:00:00",
      status: "ACTIVE",
      description: "Tietokoneen huolto ja optimointi.",
      user: user
        ? {
            userName: user.name || "Unknown",
            mail: user.email || "unknown@example.com",
            businessId: "1234567-8",
            phoneNumber: "123456",
            address: "Vantaa, FI",
          }
        : {
            userName: "Unknown",
            mail: "unknown@example.com",
            businessId: "1234567-8",
            phoneNumber: "123456",
            address: "Vantaa, FI",
          },
    },
  ];

  return (
    <section className="bg-gray-50 min-h-screen w-full">
      <main className="container mx-auto px-6 py-12 grid gap-10">
        <UserProfileCard />
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
            Tässä näet kaikki työilmoituksesi, joihin etsit työntekijöitä.
          </p>
          <TaskList tasks={omatTyot} />
        </section>
      </main>
    </section>
  );
}

import { useAuth0 } from "@auth0/auth0-react";
import { useEffect, useState } from "react";
import ProfileAboutSection from "../features/Profile/ProfileAboutSection";
import ProfileSkillsSection from "../features/Profile/UserSkillsSection";
import UserProfileCard from "../features/Profile/UserProfileCard";
import TaskList from "../features/task/components/TaskList";
import type { Task } from "../features/task/types";

export default function ProfilePage() {
  const { user, isAuthenticated, isLoading, getAccessTokenSilently } = useAuth0();
  const [userMetaData, setUserMetaData] = useState(null);
  const [jwtToken, setJwtToken] = useState<string | null>(null);

  useEffect(() => {
  const getUserMetadata = async () => {
    const domain = "jk-projects.eu.auth0.com";

    try {
      const accessToken = await getAccessTokenSilently({
        authorizationParams: {
          audience: `https://${domain}/api/v2/`,
          scope: "read:current_user",
        },
      });
      setJwtToken(accessToken);
      const userDetailsByIdUrl = `https://${domain}/api/v2/users/${user.sub}`;
      const metadataResponse = await fetch(userDetailsByIdUrl, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const { user_metadata } = await metadataResponse.json();

      setUserMetaData(user_metadata);
    } catch (e) {
      console.log(e);
    }
  };

  getUserMetadata();
}, [getAccessTokenSilently, user?.sub]);

  // Mock-työilmoitukset
  const omatTyot: Task[] = [
    {
      id: "own-1",
      title: "Varaston hyllyjen kokoaminen",
      category: "tech",
      price: "120 €",
      location: "Espoo",
      date: "2025-10-05",
    },
    {
      id: "own-2",
      title: "Pihan syyssiivous ja haravointi",
      category: "garden",
      price: "80 €",
      location: "Helsinki",
      date: "2025-10-07",
    },
    {
      id: "own-3",
      title: "Tietokoneen perushuolto ja Windowsin optimointi",
      category: "tech",
      price: "70 €",
      location: "Vantaa",
      date: "2025-10-12",
    },
  ];

    if (isLoading) {
        return <div>Loading ...</div>;
  }
  console.log("test");
  console.log(user);
  return (
    <section className="bg-gray-50 min-h-screen w-full">
    <main className="container mx-auto px-6 py-12 grid gap-10">
      <UserProfileCard
        user={
        user
          ? {
            name: user.name || "",
            picture: user.picture || "",
            email: user.email || "",
            updated_at: user.updated_at || "",
            }
          : { name: "", picture: "", email: "", updated_at: "" }
        }
      />
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

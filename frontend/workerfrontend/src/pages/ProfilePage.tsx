import { useAuth0 } from "@auth0/auth0-react";
import React from "react";
import ProfileAboutSection from "../features/Profile/ProfileAboutSection";
import ProfileSkillsSection from "../features/Profile/UserSkillsSection";
import UserProfileCard from "../features/Profile/UserProfileCard";

export default function ProfilePage() {
    const { user, isAuthenticated, isLoading } = useAuth0();

    if (isLoading) {
        return <div>Loading ...</div>;
    }

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
                            <p className="mt-1 text-gray-800">{user?.email || "Email not found"}</p>
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

            </main>
        </section>
    );
}
import type { User } from "@auth0/auth0-react";
import { useGetUserDetails } from "../../hooks/userHooks";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import EmployerDetailsEditForm from "../employer/employerDetailsEditForm";
import UserDetailsEditForm from "../userDetailsEditForm";

interface UserProfileCardProps {
  user: User | undefined;
}

export default function UserProfileCard({ user }: UserProfileCardProps) {
  
  const [isEditModeOn, setIsEditModeOn] = useState(false);
  const { data: userDetails } = useGetUserDetails();
  const queryClient = useQueryClient();
  // DATA BACKENDIIN JA AUTH0 samaan aikaan updatessa
  
  const formattedDate = user?.updated_at
      ? new Date(user?.updated_at).toLocaleDateString("fi-FI", {
      day: "numeric",
      month: "long",
      year: "numeric",
  })
  : "Information not found";
  
  return (
    <section className="bg-white rounded-lg shadow-lg py-12 px-8">
      <div className="flex flex-col md:flex-row items-center md:items-start md:space-x-12">
        <div className="flex-shrink-0 mb-8 md:mb-0">
          <img
            alt={`${user?.username || "Picture not found"}`}
            className="h-40 w-40 rounded-full object-cover border-4 border-green-400 shadow-md"
            src={
              user?.picture ||
              "Picture not found"
            }
          />
        </div>
        <div className="flex-grow text-center md:text-left">
          <h1 className="text-4xl font-bold text-gray-800">
            {user?.name || "Username not found"}
          </h1>
          <p className="text-gray-500 mt-2">
            {userDetails?.mail || "Email not found"}
          </p>
          <p className="text-green-600 font-medium mt-4">Viimeksi muokattu {formattedDate}</p>
          <div className="flex flex-col sm:flex-row gap-4 mt-8 justify-center md:justify-start">
            <button onClick={() => setIsEditModeOn(true)} className="bg-green-500 text-white px-6 py-3 rounded-md hover:bg-green-600 font-medium transition duration-150">
              Muokkaa profiilia
            </button>

            <button className="bg-white border border-gray-300 px-6 py-3 rounded-md hover:bg-gray-100 hover:border-green-400 font-medium transition duration-150">
              Omat tehtävät
            </button>
          </div>
        </div>
      </div>
      {isEditModeOn && (
                <EmployerDetailsEditForm 
                    initialValues={userDetails}
                    onSuccess={() => {
                        setIsEditModeOn(false);
                        queryClient.invalidateQueries({ queryKey: ['userDetails']});
                    }}
                    onClose={() => setIsEditModeOn(false)}
                />
              )}
    </section>
  );
}

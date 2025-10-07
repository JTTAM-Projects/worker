import type { User } from "@auth0/auth0-react";
import { useGetUserDetails } from "../hooks/userHooks";

interface UserProfileContactInfoProps {
    user: User | undefined,
}
export default function UserProfileContactInfo({ user }: UserProfileContactInfoProps) {
    const { data: userDetails } = useGetUserDetails();
    
    return (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
                <h3 className="text-sm font-medium text-gray-500">Sähköposti</h3>
                <p className="mt-1 text-gray-800">
                {user?.email || "Sähköpostia ei löytynyt"}
                </p>
            </div>
            <div>
                <h3 className="text-sm font-medium text-gray-500">Puhelinnumero</h3>
                <p className="mt-1 text-gray-800">{userDetails?.phoneNumber || "Puhelinnumeroa ei löytynyt"}</p>
            </div>
            <div>
                <h3 className="text-sm font-medium text-gray-500">Osoite</h3>
                <p className="mt-1 text-gray-800">{userDetails?.address || "Osoitetta ei löytynt"}</p>
            </div>
            <div>
                <h3 className="text-sm font-medium text-gray-500">Y-tunnus</h3>
                <p className="mt-1 text-gray-800">{userDetails?.businessId || "Osoitetta ei löytynt"}</p>
            </div>
            </div>
    );
}
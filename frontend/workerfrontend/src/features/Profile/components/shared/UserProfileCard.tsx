interface UserProfileCardProps {
    firstName: string;
    lastName: string;
    profileImageUrl?: string;
}

export default function UserProfileCard({ firstName, lastName, profileImageUrl }: UserProfileCardProps) {
    const fullName = `${firstName} ${lastName}`;
    const profileImage =
        profileImageUrl || "https://api.dicebear.com/7.x/avataaars/svg?seed=" + encodeURIComponent(fullName);

    return (
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
            <div className="flex items-center gap-4">
                <img
                    alt={fullName}
                    className="h-20 w-20 rounded-full object-cover border-2 border-green-500"
                    src={profileImage}
                />
                <h1 className="text-xl font-bold text-gray-800">{fullName}</h1>
            </div>
        </div>
    );
}

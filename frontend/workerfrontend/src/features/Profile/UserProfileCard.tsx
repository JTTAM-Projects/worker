type UserProfileCardProps = {
  user: {
    name: string,
    picture: string,
    email: string,
    updated_at: string,
  };
};
export default function UserProfileCard({ user }: UserProfileCardProps) {

    const formattedDate = user.updated_at
        ? new Date(user.updated_at).toLocaleDateString("en-EN", {
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
                            alt={`${user?.name || "Picture not found"}`}
                            className="h-40 w-40 rounded-full object-cover border-4 border-green-400 shadow-md"
                            src={user?.picture}
                        />
                    </div>
                    <div className="flex-grow text-center md:text-left">
                        <h1 className="text-4xl font-bold text-gray-800">{user?.name || "Username not found"}</h1>
                        <p className="text-gray-500 mt-2">{user?.email || "Email not found"}</p>
                        <p className="text-green-600 font-medium mt-4">Last updated {formattedDate}</p>
                        <div className="flex flex-col sm:flex-row gap-4 mt-8 justify-center md:justify-start">
                            <button className="bg-green-500 text-white px-6 py-3 rounded-md hover:bg-green-600 font-medium transition duration-150">
                                Edit profile
                            </button>
                            <button className="bg-white border border-gray-300 px-6 py-3 rounded-md hover:bg-gray-100 hover:border-green-400 font-medium transition duration-150">
                                Own tasks
                            </button>
                        </div>
                    </div>
                </div>
            </section>
    )
}

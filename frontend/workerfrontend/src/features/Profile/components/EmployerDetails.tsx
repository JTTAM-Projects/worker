import { useGetEmployerProfile } from "../hooks/EmployerHooks"
import { useGetUserDetails } from "../hooks/userHooks";

export default function EmployerDetails(){
    const { data: employerDetails } = useGetEmployerProfile();
    const { data: userDetails } = useGetUserDetails();
    
    return (
        <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Yrittäjä tietosi</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                    <h3 className="text-sm font-medium text-gray-500">Yrityksen nimi</h3>
                    <p className="mt-1 text-gray-800">{employerDetails?.companyName || "Nimeä ei löytynyt"}</p>
                </div>
                <div>
                    <h3 className="text-sm font-medium text-gray-500">Y-tunnus</h3>
                    <p className="mt-1 text-gray-800">{employerDetails?.firstName || "Tunnusta ei löytynyt"}</p>
                </div>
                <div>
                    <h3 className="text-sm font-medium text-gray-500">Verkkosivu linkki</h3>
                    <p className="mt-1 text-gray-800">{employerDetails?.websiteLink || "Linkkiä ei löytynyt"}</p>
                </div>
                <div>
                    <h3 className="text-sm font-medium text-gray-500">Työnantaja tyyppi</h3>
                    <p className="mt-1 text-gray-800">{employerDetails?.employerType || "Tietoa ei löytynyt"}</p>
                </div>
                <div>
                    <h3 className="text-sm font-medium text-gray-500">Tietoja Yrityksestäsi</h3>
                    <p className="text-gray-600 leading-relaxed">{employerDetails?.bio || "Tietoja ei löytynyt"}</p>
                </div>
            </div>
        </div>
    )
}
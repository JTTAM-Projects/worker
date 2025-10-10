import { useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";

import { useGetEmployerProfile } from "../../hooks/EmployerHooks"
import { useGetUserDetails } from "../../hooks/userHooks";

export default function EmployerDetailsProto2() {
    const { user } = useAuth0();
    const { data: employerDetails } = useGetEmployerProfile();
    const { data: userDetails } = useGetUserDetails();
    const [isEditing, setIsEditing] = useState(false);
    
    const handleSaveClick = () =>{
        setIsEditing(false);
    }

    const handleEditClick = () =>{
        setIsEditing(true);
    }
    return (
        <div>
            <div className ="flex justify-between items center" >
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Yrittäjä tietosi</h2>
                    <button
                        className="bg-green-500 text-white px-6 py-3 rounded-md hover:bg-green-600 font-medium transition duration-150"
                        onClick={isEditing ? handleSaveClick : handleEditClick}
                    >
                        {isEditing ? 'Tallenna' : 'Muokkaa'}
                    </button>
            </div>
            {isEditing ? (
            <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                        <h3 className="text-sm font-medium text-gray-500">Yrityksen nimi</h3>
                        <input type='text' className="mt-1 text-gray-800" placeholder={`${employerDetails?.companyName || "Nimeä ei löytynyt"}`} />
                    </div>
                    <div>
                        <h3 className="text-sm font-medium text-gray-500">Yrityksesi Y-tunnus</h3>
                        <input type='text' className="mt-1 text-gray-800" placeholder={`${employerDetails?.businessId || "Y-tunnusta ei löytynyt"}`} />
                    </div>
                    <div>
                        <h3 className="text-sm font-medium text-gray-500">Verkkosivu linkki</h3>
                        <input type='text' className="mt-1 text-gray-800" placeholder={`${employerDetails?.websiteLink || "Linkkiä ei löytynyt"}`} />           
                    </div>
                    <div>
                        <h3 className="text-sm font-medium text-gray-500">Työnantaja tyyppi</h3>
                        <input type='text' className="mt-1 text-gray-800" placeholder={`${employerDetails?.employerType || "Tietoa ei löytynyt"}`} />
                    </div>
                    <div>
                        <h3 className="text-sm font-medium text-gray-500">Tietoja Yrityksestäsi</h3>
                        <textarea 
                            name="bio" className="mt-1 text-gray-800" placeholder={`${employerDetails?.bio || "Tietoja ei löytynyt"}`} />
                    </div>
                </div>                    
                <h2 className="text-2xl font-bold text-gray-800">Yhteystiedot</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                        <h3 className="text-sm font-medium text-gray-500">Puhelinnumero</h3>
                        <input type='text' className="mt-1 text-gray-800" placeholder={`${userDetails?.phoneNumber || "Puhelinnumeroa ei löytynyt"}`} />
                    </div>
                    <div>
                        <h3 className="text-sm font-medium text-gray-500">Osoite</h3>
                        <input type='text' className="mt-1 text-gray-800" placeholder={`${userDetails?.address || "Osoitetta ei löytynyt"}`} />
                    </div>
                    <div>
                        <h3 className="text-sm font-medium text-gray-500">Henkilökohtainen Y-tunnuksesi</h3>
                        <input type='text' className="mt-1 text-gray-800" placeholder={`${userDetails?.businessId || "Y-tunnusta ei löytynyt"}`} />
                    </div>
                </div>
            </>
            ) : (
            <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                        <h3 className="text-sm font-medium text-gray-500">Yrityksen nimi</h3>
                        <p className="mt-1 text-gray-800">{employerDetails?.companyName || "Nimeä ei löytynyt"}</p>
                    </div>
                    <div>
                        <h3 className="text-sm font-medium text-gray-500">Yrityksesi Y-tunnus</h3>
                        <p className="mt-1 text-gray-800">{employerDetails?.businessId || "Tunnusta ei löytynyt"}</p>
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
                <h2 className="text-2xl font-bold text-gray-800 pt-4 pb-4">Yhteystiedot</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                        <h3 className="text-sm font-medium text-gray-500">Sähköposti</h3>
                        <p className="mt-1 text-gray-800">{user?.email || "Sähköpostia ei löytynyt"}</p>
                    </div>
                    <div>
                        <h3 className="text-sm font-medium text-gray-500">Puhelinnumero</h3>
                        <p className="mt-1 text-gray-800">{userDetails?.phoneNumber || "Puhelinnumeroa ei löytynyt"}</p>
                    </div>
                    <div>
                        <h3 className="text-sm font-medium text-gray-500">Osoite</h3>
                        <p className="mt-1 text-gray-800">{userDetails?.address || "Osoitetta ei löytynyt"}</p>
                    </div>
                    <div>
                        <h3 className="text-sm font-medium text-gray-500">Henkilökohtainen Y-tunnuksesi</h3>
                        <p className="mt-1 text-gray-800">{userDetails?.businessId || "Y-tunnusta ei löytynyt"}</p>
                    </div>
                </div>
            </>
            )}
        </div>
    )
}
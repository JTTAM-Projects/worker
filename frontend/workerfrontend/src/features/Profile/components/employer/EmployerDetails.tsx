import { useAuth0 } from "@auth0/auth0-react"; //TODO remove
import { useState } from "react";

import { useGetEmployerProfile, useUpdateEmployer, useCreateEmployerProfile } from "../../hooks/EmployerHooks"
import { useCreateUser, useGetUserDetails, useUpdateUser } from "../../hooks/userHooks";
import type { EmployerType } from "../../types";

export default function EmployerDetails(){
    const { user } = useAuth0(); //TODO use props
    const { data: employerDetails } = useGetEmployerProfile();
    const { data: userDetails } = useGetUserDetails();
    const { mutate: updateEmployer } = useUpdateEmployer();
    const { mutate: createEmployer } = useCreateEmployerProfile();
    const { mutate: updateUser } = useUpdateUser();
    const { mutate: createUser } = useCreateUser();
    const [isEditing, setIsEditing] = useState(false);

    const [formData, setFormData] = useState({
        companyName: employerDetails?.companyName || "",
        businessId: employerDetails?.businessId || "",
        websiteLink: employerDetails?.websiteLink || "",
        employerType: employerDetails?.employerType || "",
        bio: employerDetails?.bio || "",
        email: user?.email || "",
        phoneNumber: userDetails?.phoneNumber || "",
        address: userDetails?.address || "",
        personalBusinessId: userDetails?.businessId || ""
    })
    
    const handleSaveClick = async () => {
        try {
            if(employerDetails){
                await updateEmployer({
                    companyName: formData.companyName,
                    businessId: formData.businessId,
                    websiteLink: formData.websiteLink,
                    employerType: formData.employerType,
                    bio: formData.bio
            });

            await updateUser({
                phoneNumber: formData.phoneNumber,
                address: formData.address,
                businessId: formData.personalBusinessId
            });
            } else {
                await createEmployer({
                    userId: user?.sub || '',                    
                    firstName: employerDetails?.firstName || "",
                    lastName: employerDetails?.lastName || "",
                    streetAddress: userDetails?.address || "",
                    postalCode: userDetails?.postalCode || "",
                    email: user?.email || "",
                    companyName: formData.companyName,
                    businessId: formData.businessId,
                    websiteLink: formData.websiteLink,
                    employerType: formData.employerType,
                    bio: formData.bio,
                })
            }

            setIsEditing(false);
        } catch (error) {
            console.error('Failed to update profile:', error);
        }
    };

    const handleEditClick = () => {
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
                        <input type='text' 
                            name="companyName"
                            value={formData.companyName}
                            onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                            className="mt-1 text-gray-800" placeholder={`${employerDetails?.companyName || "Nimeä ei löytynyt"}`} />
                    </div>
                    <div>
                        <h3 className="text-sm font-medium text-gray-500">Yrityksesi Y-tunnus</h3>
                        <input type='text' 
                            name="businessId"
                            value={formData.businessId}
                            onChange={(e) => setFormData({ ...formData, businessId: e.target.value })}
                            className="mt-1 text-gray-800" placeholder={`${employerDetails?.businessId || "Y-tunnusta ei löytynyt"}`} />
                    </div>
                    <div>
                        <h3 className="text-sm font-medium text-gray-500">Verkkosivu linkki</h3>
                        <input type='text' 
                            name="websiteLink"
                            value={formData.websiteLink}
                            onChange={(e) => setFormData({ ...formData, websiteLink: e.target.value })}
                            className="mt-1 text-gray-800" placeholder={`${employerDetails?.websiteLink || "Linkkiä ei löytynyt"}`} />           
                    </div>
                    <div>
                        <h3 className="text-sm font-medium text-gray-500">Työnantaja tyyppi</h3>
                        <input type='text'
                            name="companyName"
                            value={formData.companyName}
                            onChange={(e) => setFormData({ ...formData, companyName: e.target.value })} 
                            className="mt-1 text-gray-800" placeholder={`${employerDetails?.employerType || "Tietoa ei löytynyt"}`} />
                    </div>
                    <div>
                        <h3 className="text-sm font-medium text-gray-500">Tietoja Yrityksestäsi</h3>
                        <textarea 
                            name="bio"
                            value={formData.bio}
                            onChange={(e) => setFormData({ ...formData, bio: e.target.value })} 
                            className="mt-1 text-gray-800" placeholder={`${employerDetails?.bio || "Tietoja ei löytynyt"}`} />
                    </div>
                </div>                    
                <h2 className="text-2xl font-bold text-gray-800">Yhteystiedot</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                        <h3 className="text-sm font-medium text-gray-500">Puhelinnumero</h3>
                        <input type='text' className="mt-1 text-gray-800" 
                            name="phoneNumber"
                            value={formData.phoneNumber}
                            onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })} 
                            placeholder={`${userDetails?.phoneNumber || "Puhelinnumeroa ei löytynyt"}`} />
                    </div>
                    <div>
                        <h3 className="text-sm font-medium text-gray-500">Osoite</h3>
                        <input type='text' 
                            name="address"
                            value={formData.address}
                            onChange={(e) => setFormData({ ...formData, address: e.target.value })} 
                            className="mt-1 text-gray-800" placeholder={`${userDetails?.address || "Osoitetta ei löytynyt"}`} />
                    </div>
                    <div>
                        <h3 className="text-sm font-medium text-gray-500">Henkilökohtainen Y-tunnuksesi</h3>
                        <input type='text' 
                            name="personalBusinessId"
                            value={formData.personalBusinessId}
                            onChange={(e) => setFormData({ ...formData, personalBusinessId: e.target.value })} 
                            className="mt-1 text-gray-800" placeholder={`${userDetails?.businessId || "Y-tunnusta ei löytynyt"}`} />
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
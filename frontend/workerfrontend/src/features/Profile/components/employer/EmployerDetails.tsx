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
        userId: user?.sub || "",
        firstName: user?.given_name || "Testi", //TODO: poista testi data
        lastName: user?.family_name || "Testaaja", //TODO: poista testi data
        employerType: employerDetails?.employerType || "",
        streetAddress: employerDetails?.streetAddress || "",
        postalCode: employerDetails?.postalCode || "",
        city: employerDetails?.city || "",
        country: employerDetails?.country || "",
        bio: employerDetails?.bio || "",        
        companyName: employerDetails?.companyName || "", 
        businessId: employerDetails?.businessId || "",
        websiteLink: employerDetails?.websiteLink || "",
        profileImageUrl: employerDetails?.profileImageUrl || "",
        phoneNumber: userDetails?.phoneNumber || "",
        address: userDetails?.address || "",
        personalBusinessId: userDetails?.businessId || "",       
        email: user?.email || "", 
    })
    
    const handleSaveClick = async () => {
        try {
            if(employerDetails){
                await updateEmployer({
                    firstName: formData.firstName,
                    lastName: formData.lastName,
                    employerType: formData.employerType,
                    streetAddress: userDetails?.address || "",
                    postalCode: formData.postalCode || "",
                    city: formData.city,
                    country: formData.country,
                    bio: formData.bio,
                    companyName: formData.companyName,
                    businessId: formData.businessId,
                    websiteLink: formData.websiteLink,
                    profileImageUrl: formData.profileImageUrl
                });
                await updateUser({
                    userName: formData.userId,
                    mail: formData.email,
                    phoneNumber: formData.phoneNumber,
                    address: `${formData.streetAddress} ${formData.postalCode}, ${formData.city.toUpperCase()} ${formData.country}`,
                    businessId: formData.personalBusinessId
                });
            } else {
                await createUser({
                    userName: formData.userId,
                    mail: formData.email,
                    businessId: formData.personalBusinessId,
                    phoneNumber: formData.phoneNumber,
                    address: `${formData.streetAddress} ${formData.postalCode}, ${formData.city.toUpperCase()} ${formData.country}`
                })
                await createEmployer({
                    userId: formData.userId,                    
                    firstName: formData.firstName,
                    lastName: formData.lastName,
                    employerType: formData.employerType,
                    streetAddress: userDetails?.address || "",
                    postalCode: formData.postalCode || "",
                    city: formData.city,
                    country: formData.country,
                    bio: formData.bio,
                    companyName: formData.companyName,
                    businessId: formData.businessId,
                    websiteLink: formData.websiteLink,
                    profileImageUrl: formData.profileImageUrl,
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
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500" 
                            placeholder={`${employerDetails?.companyName || "Nimeä ei löytynyt"}`} />
                    </div>
                    <div>
                        <h3 className="text-sm font-medium text-gray-500">Yrityksesi Y-tunnus</h3>
                        <input type='text' 
                            name="businessId"
                            value={formData.businessId}
                            onChange={(e) => setFormData({ ...formData, businessId: e.target.value })}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500" 
                            placeholder={`${employerDetails?.businessId || "Y-tunnusta ei löytynyt"}`} />
                    </div>
                    <div>
                        <h3 className="text-sm font-medium text-gray-500">Verkkosivu linkki</h3>
                        <input type='text' 
                            name="websiteLink"
                            value={formData.websiteLink}
                            onChange={(e) => setFormData({ ...formData, websiteLink: e.target.value })}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                            placeholder={`${employerDetails?.websiteLink || "Linkkiä ei löytynyt"}`} />           
                    </div>
                    <div>
                        <h3 className="text-sm font-medium text-gray-500">Työnantaja tyyppi</h3>
                        <select
                            name="employerType"
                            value={formData.employerType}
                            onChange={(e) => setFormData({ ...formData, employerType: e.target.value })}
                            className="mt-1 block rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                        >
                            <option value="">Valitse työnantaja tyyppi</option>
                            <option value="INDIVIDUAL">Yksityishenkilö</option>
                            <option value="COMPANY">Yritys</option>
                        </select>
                    </div>
                </div>
                    <div>
                        <h3 className="text-sm font-medium text-gray-500 pt-4">Tietoja Yrityksestäsi</h3>
                        <textarea 
                            name="bio"
                            value={formData.bio}
                            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                            placeholder={`${employerDetails?.bio || "Tietoja ei löytynyt"}`} />
                    </div>                    
                <h2 className="text-2xl font-bold text-gray-800">Yhteystiedot</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                        <h3 className="text-sm font-medium text-gray-500">Puhelinnumero</h3>
                        <input 
                            type='text'  
                            name="phoneNumber"
                            value={formData.phoneNumber}
                            onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })} 
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                            placeholder={`${userDetails?.phoneNumber || "Puhelinnumeroa ei löytynyt"}`} />
                    </div>
                    <div>
                        <h3 className="text-sm font-medium text-gray-500">Osoite</h3>
                        <div className="space-y-2">
                            <input type='text' 
                                name="streetAddress"
                                value={formData.streetAddress}
                                onChange={(e) => setFormData({ ...formData, streetAddress: e.target.value })} 
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500" 
                                placeholder={`${employerDetails?.streetAddress || "Katu"}`} 
                            />
                            <input type='text'
                                name="postalCode"
                                value={formData.postalCode}
                                onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })} 
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500" 
                                placeholder={`${employerDetails?.postalCode || "postikoodi"}`} 
                            />
                            <input type='text' 
                                name="city"
                                value={formData.city}
                                onChange={(e) => setFormData({ ...formData, city: e.target.value })} 
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500" 
                                placeholder={`${employerDetails?.city || "Kaupunki"}`} 
                            />
                            <input type='text' 
                                name="country"
                                value={formData.country}
                                onChange={(e) => setFormData({ ...formData, country: e.target.value })} 
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500" 
                                placeholder={`${employerDetails?.country || "Maa"}`} 
                            />
                        </div>
                    </div>
                    <div>
                        <h3 className="text-sm font-medium text-gray-500">Henkilökohtainen Y-tunnuksesi</h3>
                        <input type='text' 
                            name="personalBusinessId"
                            value={formData.personalBusinessId}
                            onChange={(e) => setFormData({ ...formData, personalBusinessId: e.target.value })} 
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                            placeholder={`${userDetails?.businessId || "Y-tunnusta ei löytynyt"}`} />
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
                </div>
                <div>
                    <h3 className="text-sm font-medium text-gray-500 pt-4">Tietoja Yrityksestäsi</h3>
                    <p className="text-gray-600 leading-relaxed">{employerDetails?.bio || "Tietoja ei löytynyt"}</p>
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
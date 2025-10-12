import { useState } from 'react';
import { useCreateUser, useGetUserDetails, useUpdateUser } from "../../hooks/userHooks";
import ProfileSkillsSection from "../UserSkillsSection"
import { useCreateTasker, useGetTaskerDetails,useUpdateTaskerDetails } from '../../hooks/taskerHooks'
import { useAuth0 } from '@auth0/auth0-react';



//TODO use props for user

export default function TaskerDetails () {

    const { user } = useAuth0();
    const { data: userDetails } = useGetUserDetails();
    const { data: taskerDetails } = useGetTaskerDetails();
    const { mutate: createTasker } = useCreateTasker();
    const { mutate: createUser } = useCreateUser();
    const { mutate: updateTasker } = useUpdateTaskerDetails();
    const { mutate: updateUser } = useUpdateUser();
    const [ isEditing, setIsEditing ] = useState(false);

    const [formData, setFormData] = useState({
        userId: user?.sub || "",
        firstName: user?.given_name || "Testi", //TODO: poista testi data
        lastName: user?.family_name || "Testaaja",
        bio: taskerDetails?.bio || "",
        streetAddress: taskerDetails?.streetAddress || "",
        postalCode: taskerDetails?.postalCode || "",
        city: taskerDetails?.city || "",
        country: taskerDetails?.country || "",
        websiteLink: taskerDetails?.websiteLink || "",
        profileImageUrl: taskerDetails?.profileImageUrl || "",
        businessId: userDetails?.businessId || "",       
        email: user?.email || "",        
        phoneNumber: userDetails?.phoneNumber || "",
    })

    const handleSaveClick = async () => {
        try {
            if(taskerDetails){
                await updateTasker({
                    firstName: formData.firstName,
                    lastName: formData.lastName,
                    streetAddress: userDetails?.address || "",
                    postalCode: formData.postalCode || "",
                    city: formData.city,
                    country: formData.country,
                    bio: formData.bio,
                    websiteLink: formData.websiteLink,
                    profileImageUrl: formData.profileImageUrl
                });
                await updateUser({
                    userName: formData.userId,
                    mail: formData.email,
                    phoneNumber: formData.phoneNumber,
                    address: `${formData.streetAddress} ${formData.postalCode}, ${formData.city.toUpperCase()} ${formData.country}`,
                    businessId: formData.businessId
                });
            } else {
                await createUser({
                    userName: formData.userId,
                    mail: formData.email,
                    businessId: formData.businessId,
                    phoneNumber: formData.phoneNumber,
                    address: `${formData.streetAddress} ${formData.postalCode}, ${formData.city.toUpperCase()} ${formData.country}`
                })
                await createTasker({                  
                    firstName: formData.firstName,
                    lastName: formData.lastName,
                    streetAddress: userDetails?.address || "",
                    postalCode: formData.postalCode || "",
                    city: formData.city,
                    country: formData.country,
                    bio: formData.bio,
                    websiteLink: formData.websiteLink,
                    profileImageUrl: formData.profileImageUrl,
                })
            }
            setIsEditing(false);
        } catch (error) {
            console.error('Failed to update profile:', error);
        }
    }

    const handleEditClick = () => {
        setIsEditing(true);
    }

    return (
        <div>
            <div className ="flex justify-between items center" >
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Työntekijä tietosi</h2>
                    <button
                        className="bg-green-500 text-white px-6 py-3 rounded-md hover:bg-green-600 font-medium transition duration-150"
                        onClick={isEditing ? handleSaveClick : handleEditClick}
                    >
                        {isEditing ? 'Tallenna' : 'Muokkaa'}
                    </button>
            </div>

        {isEditing ? (
            <>
                <h2 className="text-2xl font-bold text-gray-800 pt-4 pb-4">Tietoja sinusta</h2>
                <div>
                    <textarea
                        name="bio"
                        value={formData.bio}
                        onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                        rows={4}
                        placeholder="Kerro itsestäsi"
                    />
                </div>

                <h2 className="text-2xl font-bold text-gray-800 pt-4 pb-4">Yhteystiedot</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                        <h3 className="text-sm font-medium text-gray-500">Sähköposti</h3>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                            placeholder="Sähköposti"
                        />
                    </div>
                    <div>
                        <h3 className="text-sm font-medium text-gray-500">Puhelinnumero</h3>
                        <input
                            type="tel"
                            name="phoneNumber"
                            value={formData.phoneNumber}
                            onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                            placeholder="Puhelinnumero"
                        />
                    </div>
                    <div>
                        <h3 className="text-sm font-medium text-gray-500">Osoitetiedot</h3>
                        <div className="space-y-2">
                            <input
                                type="text"
                                name="streetAddress"
                                value={formData.streetAddress}
                                onChange={(e) => setFormData({ ...formData, streetAddress: e.target.value })}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                                placeholder="Katuosoite"
                            />
                            <input
                                type="text"
                                name="postalCode"
                                value={formData.postalCode}
                                onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                                placeholder="Postinumero"
                            />
                            <input
                                type="text"
                                name="city"
                                value={formData.city}
                                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                                placeholder="Kaupunki"
                            />
                            <input
                                type="text"
                                name="country"
                                value={formData.country}
                                onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                                placeholder="Maa"
                            />
                        </div>
                    </div>
                    <div>
                        <h3 className="text-sm font-medium text-gray-500">Henkilökohtainen Y-tunnuksesi</h3>
                        <input
                            type="text"
                            name="businessId"
                            value={formData.businessId}
                            onChange={(e) => setFormData({ ...formData, businessId: e.target.value })}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                            placeholder="Y-tunnus"
                        />
                    </div>
                </div>
            </>
        ) : (
            <>
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Tietoja sinusta</h1>
                    <p className="mt-1 text-gray-800">{taskerDetails?.bio || "Ttietoja ei löytynyt"}</p>
                </div>
                <ProfileSkillsSection />
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
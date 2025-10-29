import { useAuth0 } from "@auth0/auth0-react"; //TODO remove
import { useState } from "react";

import { useGetEmployerProfile, useUpdateEmployer, useCreateEmployerProfile } from "../../hooks/EmployerHooks"
import { useCreateUser, useGetUserDetails, useUpdateUser } from "../../hooks/userHooks";
import { FormField } from "../shared/FormField";

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

            //Format websitelinks to proper form
            const formattedWebsiteLink = formData.websiteLink 
                ? formData.websiteLink.startsWith('http') 
                    ? formData.websiteLink 
                    : `https://${formData.websiteLink}`
                : '';

            const formattedProfileImageUrl = formData.websiteLink 
                ? formData.websiteLink.startsWith('http') 
                    ? formData.websiteLink 
                    : `https://${formData.websiteLink}`
                : '';

            if(employerDetails && userDetails){
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
                    websiteLink: formattedWebsiteLink,
                    profileImageUrl: formattedProfileImageUrl
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

    const handleInputChange = (name: string, value: string) => {
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    interface FormFieldConfig {
        label: string;
        name: string;
        placeholder: string;
        isTextArea?: boolean;
    }
    const formFields: Record<'employer' | 'user', FormFieldConfig[]> = {
        employer: [
            { label: 'Yrityksen nimi', name: 'companyName', placeholder: 'Nimeä ei löytynyt' },
            { label: 'Yrityksesi Y-tunnus', name: 'businessId', placeholder: 'Y-tunnusta ei löytynyt' },
            { label: 'Verkkosivu linkki', name: 'websiteLink', placeholder: 'Linkkiä ei löytynyt' },
            { label: 'Tietoja Yrityksestäsi', name: 'bio', placeholder: 'Tietoja ei löytynyt', isTextArea: true },
        ],
        user: [
            { label: 'Puhelinnumero', name: 'phoneNumber', placeholder: 'Puhelinnumeroa ei löytynyt' },
            { label: 'Katuosoite', name: 'streetAddress', placeholder: 'Katu' },
            { label: 'Postinumero', name: 'postalCode', placeholder: 'postikoodi' },
            { label: 'Kaupunki', name: 'city', placeholder: 'Kaupunki' },
            { label: 'Maa', name: 'country', placeholder: 'Maa' },
            { label: 'Henkilökohtainen Y-tunnuksesi', name: 'personalBusinessId', placeholder: 'Y-tunnusta ei löytynyt' },
        ]
    };
    return (
    <div className="space-y-8">
        <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-800">Yrittäjä tietosi</h2>
            <button
                className="bg-green-500 text-white px-6 py-3 rounded-md hover:bg-green-600 font-medium transition duration-150"
                onClick={isEditing ? handleSaveClick : handleEditClick}
            >
                {isEditing ? 'Tallenna' : 'Muokkaa'}
            </button>
        </div>

        {isEditing ? (
            <div className="space-y-8">
                <div>
                    <h2 className="text-xl font-semibold text-gray-700 mb-4">Yrityksen tiedot</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {formFields.employer.map(field => (
                            <FormField
                                key={field.name}
                                label={field.label}
                                name={field.name}
                                value={formData[field.name as keyof typeof formData]}
                                onChange={handleInputChange}
                                placeholder={field.placeholder}
                                isTextArea={field.isTextArea}
                            />
                        ))}
                        <div>
                            <h3 className="text-sm font-medium text-gray-500">Työnantaja tyyppi</h3>
                            <select
                                name="employerType"
                                value={formData.employerType}
                                onChange={(e) => handleInputChange('employerType', e.target.value)}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                            >
                                <option value="">Valitse työnantaja tyyppi</option>
                                <option value="INDIVIDUAL">Yksityishenkilö</option>
                                <option value="COMPANY">Yritys</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div>
                    <h2 className="text-xl font-semibold text-gray-700 mb-4">Henkilötiedot</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {formFields.user.map(field => (
                            <FormField
                                key={field.name}
                                label={field.label}
                                name={field.name}
                                value={formData[field.name as keyof typeof formData]}
                                onChange={handleInputChange}
                                placeholder={field.placeholder}
                                isTextArea={field.isTextArea}
                            />
                        ))}
                    </div>
                </div>
            </div>
        ) : (
            <div className="space-y-8">
                <div>
                    <h2 className="text-xl font-semibold text-gray-700 mb-4">Yrityksen tiedot</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {formFields.employer.map(field => (
                            <div key={field.name}>
                                <h3 className="text-sm font-medium text-gray-500">{field.label}</h3>
                                <p className="mt-1 text-gray-800">
                                    {employerDetails?.[field.name as keyof typeof employerDetails] || field.placeholder}
                                </p>
                            </div>
                        ))}
                        <div>
                            <h3 className="text-sm font-medium text-gray-500">Työnantaja tyyppi</h3>
                            <p className="mt-1 text-gray-800">
                                {employerDetails?.employerType || 'Työnantaja tyyppiä ei valittu'}
                            </p>
                        </div>
                    </div>
                </div>

                <div>
                    <h2 className="text-xl font-semibold text-gray-700 mb-4">Henkilötiedot</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {formFields.user.map(field => (
                            <div key={field.name}>
                                <h3 className="text-sm font-medium text-gray-500">{field.label}</h3>
                                <p className="mt-1 text-gray-800">
                                    {userDetails?.[field.name as keyof typeof userDetails] || field.placeholder}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        )}
    </div>
    );
}
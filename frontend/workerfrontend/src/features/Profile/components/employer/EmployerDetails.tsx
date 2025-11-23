import { useAuth } from "../../../../auth/useAuth";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { profileStyles, buttonStyles, formStyles } from "../../../../ui-library/stylesConfig";
import { useGetEmployerProfile, useUpdateEmployer, useCreateEmployerProfile } from "../../hooks/EmployerHooks"
import { useCreateUser, useGetUserDetails, useUpdateUser } from "../../hooks/userHooks";

export default function EmployerDetails(){
  const { user } = useAuth();
    const { data: userDetails } = useGetUserDetails();
    const { data: employerDetails } = useGetEmployerProfile();    
    const { mutateAsync: updateEmployer } = useUpdateEmployer();
    const { mutateAsync: createEmployer } = useCreateEmployerProfile();
    const { mutateAsync: updateUser } = useUpdateUser();
    const { mutateAsync: createUser } = useCreateUser();
    const [isEditing, setIsEditing] = useState(false);
    const queryClient = useQueryClient();

    const [formData, setFormData] = useState({
        userId: user?.sub || "",
        firstName: user?.given_name || "Testi", //TODO delete default data later
        lastName: user?.family_name || "Testaaja", //TODO delete default data later
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
            const userPayload = {
                userName: formData.userId,
                mail: formData.email,
                businessId: formData.personalBusinessId,
                phoneNumber: formData.phoneNumber,
                address: `${formData.streetAddress} ${formData.postalCode}, ${formData.city.toUpperCase()} ${formData.country}`
            };

            const employerPayload = {
                userId: formData.userId,
                firstName: formData.firstName,
                lastName: formData.lastName,
                employerType: formData.employerType,
                streetAddress: formData.streetAddress || "",
                postalCode: formData.postalCode || "",
                city: formData.city,
                country: formData.country,
                bio: formData.bio,
                companyName: formData.companyName,
                businessId: formData.businessId,
                websiteLink: formData.websiteLink,
                profileImageUrl: formData.profileImageUrl,
            };

            if (employerDetails) {
                await Promise.all([
                    updateEmployer(employerPayload),
                    updateUser(userPayload)
                ]);
            } else if (userDetails) {
                await updateUser(userPayload);
                await createEmployer(employerPayload);
            } else {
                await createUser(userPayload);
                await createEmployer(employerPayload);
            }

            await Promise.all([
                queryClient.invalidateQueries({ queryKey: ['userDetails'] }),
                queryClient.invalidateQueries({ queryKey: ['employerDetails'] })
            ]);

            setIsEditing(false);
        } catch (error) {
            console.error('Failed to update profile:', error);
        }
    };

    const handleEditClick = () => {
        setIsEditing(true);
    }

    return (
        <div className={profileStyles.container}>
            <div className={profileStyles.header}>
                <h2 className={profileStyles.title}>Yrittäjä tietosi</h2>
                <button
                    className={buttonStyles.saveButton}
                    onClick={isEditing ? handleSaveClick : handleEditClick}
                >
                    {isEditing ? 'Tallenna' : 'Muokkaa'}
                </button>
            </div>

            {isEditing ? (
            <>
                <div className={profileStyles.grid}>
                    <div className={profileStyles.fieldGroup}>
                        <h3 className={profileStyles.label}>Yrityksen nimi</h3>
                        <input 
                            type='text' 
                            name="companyName"
                            value={formData.companyName}
                            onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                            className={formStyles.input}
                            placeholder={employerDetails?.companyName || "Nimeä ei löytynyt"} 
                        />
                    </div>

                    <div className={profileStyles.fieldGroup}>
                        <h3 className={profileStyles.label}>Yrityksesi Y-tunnus</h3>
                        <input 
                            type='text' 
                            name="businessId"
                            value={formData.businessId}
                            onChange={(e) => setFormData({ ...formData, businessId: e.target.value })}
                            className={formStyles.input}
                            placeholder={employerDetails?.businessId || "Y-tunnusta ei löytynyt"} 
                        />
                    </div>

                    <div className={profileStyles.fieldGroup}>
                        <h3 className={profileStyles.label}>Verkkosivu linkki</h3>
                        <input 
                            type='text' 
                            name="websiteLink"
                            value={formData.websiteLink}
                            onChange={(e) => setFormData({ ...formData, websiteLink: e.target.value })}
                            className={formStyles.input}
                            placeholder={employerDetails?.websiteLink || "Linkkiä ei löytynyt"} 
                        />           
                    </div>

                    <div className={profileStyles.fieldGroup}>
                        <h3 className={profileStyles.label}>Työnantaja tyyppi</h3>
                        <select
                            name="employerType"
                            value={formData.employerType}
                            onChange={(e) => setFormData({ ...formData, employerType: e.target.value })}
                            className={formStyles.select}
                        >
                            <option value="">Valitse työnantaja tyyppi</option>
                            <option value="INDIVIDUAL">Yksityishenkilö</option>
                            <option value="COMPANY">Yritys</option>
                        </select>
                    </div>
                </div>

                <div className={profileStyles.fieldGroup}>
                    <h3 className={profileStyles.subsectionTitle}>Tietoja Yrityksestäsi</h3>
                    <textarea 
                        name="bio"
                        value={formData.bio}
                        onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                        className={formStyles.textarea}
                        rows={4}
                        placeholder={employerDetails?.bio || "Tietoja ei löytynyt"} 
                    />
                </div>

                <h2 className={profileStyles.sectionTitle}>Yhteystiedot</h2>

                <div className={profileStyles.grid}>
                    <div className={profileStyles.fieldGroup}>
                        <h3 className={profileStyles.label}>Puhelinnumero</h3>
                        <input 
                            type='tel'  
                            name="phoneNumber"
                            value={formData.phoneNumber}
                            onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })} 
                            className={formStyles.input}
                            placeholder={userDetails?.phoneNumber || "Puhelinnumeroa ei löytynyt"} 
                        />
                    </div>

                    <div className={profileStyles.fieldGroup}>
                        <h3 className={profileStyles.label}>Osoite</h3>
                        <div className={profileStyles.addressGroup}>
                            <input 
                                type='text' 
                                name="streetAddress"
                                value={formData.streetAddress}
                                onChange={(e) => setFormData({ ...formData, streetAddress: e.target.value })} 
                                className={formStyles.input}
                                placeholder={employerDetails?.streetAddress || "Katuosoite"} 
                            />
                            <input 
                                type='text'
                                name="postalCode"
                                value={formData.postalCode}
                                onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })} 
                                className={formStyles.input}
                                placeholder={employerDetails?.postalCode || "Postinumero"} 
                            />
                            <input 
                                type='text' 
                                name="city"
                                value={formData.city}
                                onChange={(e) => setFormData({ ...formData, city: e.target.value })} 
                                className={formStyles.input}
                                placeholder={employerDetails?.city || "Kaupunki"} 
                            />
                            <input 
                                type='text' 
                                name="country"
                                value={formData.country}
                                onChange={(e) => setFormData({ ...formData, country: e.target.value })} 
                                className={formStyles.input}
                                placeholder={employerDetails?.country || "Maa"} 
                            />
                        </div>
                    </div>

                    <div className={profileStyles.fieldGroup}>
                        <h3 className={profileStyles.label}>Henkilökohtainen Y-tunnuksesi</h3>
                        <input 
                            type='text' 
                            name="personalBusinessId"
                            value={formData.personalBusinessId}
                            onChange={(e) => setFormData({ ...formData, personalBusinessId: e.target.value })} 
                            className={formStyles.input}
                            placeholder={userDetails?.businessId || "Y-tunnusta ei löytynyt"} 
                        />
                    </div>
                </div>
            </>
            ) : (
            <>
                <div className={profileStyles.grid}>
                    <div className={profileStyles.fieldGroup}>
                        <h3 className={profileStyles.label}>Yrityksen nimi</h3>
                        <p className={profileStyles.text}>{employerDetails?.companyName || "Nimeä ei löytynyt"}</p>
                    </div>

                    <div className={profileStyles.fieldGroup}>
                        <h3 className={profileStyles.label}>Yrityksesi Y-tunnus</h3>
                        <p className={profileStyles.text}>{employerDetails?.businessId || "Tunnusta ei löytynyt"}</p>
                    </div>

                    <div className={profileStyles.fieldGroup}>
                        <h3 className={profileStyles.label}>Verkkosivu linkki</h3>
                        <p className={profileStyles.text}>{employerDetails?.websiteLink || "Linkkiä ei löytynyt"}</p>
                    </div>

                    <div className={profileStyles.fieldGroup}>
                        <h3 className={profileStyles.label}>Työnantaja tyyppi</h3>
                        <p className={profileStyles.text}>{employerDetails?.employerType || "Tietoa ei löytynyt"}</p>
                    </div>
                </div>

                <div className={profileStyles.fieldGroup}>
                    <h3 className={profileStyles.subsectionTitle}>Tietoja Yrityksestäsi</h3>
                    <p className={profileStyles.bioText}>{employerDetails?.bio || "Tietoja ei löytynyt"}</p>
                </div>

                <h2 className={profileStyles.sectionTitle}>Yhteystiedot</h2>

                <div className={profileStyles.grid}>
                    <div className={profileStyles.fieldGroup}>
                        <h3 className={profileStyles.label}>Sähköposti</h3>
                        <p className={profileStyles.text}>{user?.email || "Sähköpostia ei löytynyt"}</p>
                    </div>

                    <div className={profileStyles.fieldGroup}>
                        <h3 className={profileStyles.label}>Puhelinnumero</h3>
                        <p className={profileStyles.text}>{userDetails?.phoneNumber || "Puhelinnumeroa ei löytynyt"}</p>
                    </div>

                    <div className={profileStyles.fieldGroup}>
                        <h3 className={profileStyles.label}>Osoite</h3>
                        <p className={profileStyles.text}>{userDetails?.address || "Osoitetta ei löytynyt"}</p>
                    </div>

                    <div className={profileStyles.fieldGroup}>
                        <h3 className={profileStyles.label}>Henkilökohtainen Y-tunnuksesi</h3>
                        <p className={profileStyles.text}>{userDetails?.businessId || "Y-tunnusta ei löytynyt"}</p>
                    </div>
                </div>
            </>
            )}
        </div>
    )
}

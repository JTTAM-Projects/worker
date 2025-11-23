import { useState } from 'react';
import { useAuth } from '../../../../auth/useAuth';
import { useQueryClient } from '@tanstack/react-query';
import { profileStyles, buttonStyles, formStyles } from "../../../../ui-library/stylesConfig";
import { useCreateUser, useGetUserDetails, useUpdateUser } from "../../hooks/userHooks";
import { useCreateTasker, useGetTaskerDetails, useUpdateTaskerDetails } from '../../hooks/taskerHooks';
import ProfileSkillsSection from "../UserSkillsSection";

export default function TaskerDetails() {
    const { user } = useAuth();
    const { data: userDetails } = useGetUserDetails();
    const { data: taskerDetails } = useGetTaskerDetails();
    const { mutateAsync: createTasker } = useCreateTasker();
    const { mutateAsync: createUser } = useCreateUser();
    const { mutateAsync: updateTasker } = useUpdateTaskerDetails();
    const { mutateAsync: updateUser } = useUpdateUser();
    const [isEditing, setIsEditing] = useState(false);
    const queryClient = useQueryClient();

    const [formData, setFormData] = useState({
        userId: user?.sub || "",
        firstName: user?.given_name || "Testi", //TODO delete default data later
        lastName: user?.family_name || "Testaaja", //TODO delete default data later
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
    });

    const handleSaveClick = async () => {
        try {
            const userPayload = {
                userName: formData.userId,
                mail: formData.email,
                businessId: formData.businessId,
                phoneNumber: formData.phoneNumber,
                address: `${formData.streetAddress} ${formData.postalCode}, ${formData.city.toUpperCase()} ${formData.country}`
            };

            const taskerPayload = {
                firstName: formData.firstName,
                lastName: formData.lastName,
                streetAddress: userDetails?.address || "",
                postalCode: formData.postalCode || "",
                city: formData.city,
                country: formData.country,
                bio: formData.bio,
                websiteLink: formData.websiteLink,
                profileImageUrl: formData.profileImageUrl
            };

            if (taskerDetails) {
                await Promise.all([
                    updateUser(userPayload),
                    updateTasker(taskerPayload)
                ]);
            } else if (userDetails) {
                await updateUser(userPayload);
                await createTasker(taskerPayload);
            } else {
                await createUser(userPayload);
                await createTasker(taskerPayload);
            }

            await Promise.all([
                queryClient.invalidateQueries({ queryKey: ['taskerDetails'] }),
                queryClient.invalidateQueries({ queryKey: ['userDetails'] })
            ]);

            setIsEditing(false);
        } catch (error) {
            console.error('Failed to update profile:', error);
        }
    };

    const handleEditClick = () => {
        setIsEditing(true);
    };

    return (
        <div className={profileStyles.container}>
            <div className={profileStyles.header}>
                <h2 className={profileStyles.title}>Työntekijä tietosi</h2>
                <button
                    className={buttonStyles.saveButton}
                    onClick={isEditing ? handleSaveClick : handleEditClick}
                >
                    {isEditing ? 'Tallenna' : 'Muokkaa'}
                </button>
            </div>

            {isEditing ? (
            <>
                <h2 className={profileStyles.sectionTitle}>Tietoja sinusta</h2>
                <div className={profileStyles.fieldGroup}>
                    <textarea
                        name="bio"
                        value={formData.bio}
                        onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                        className={formStyles.textarea}
                        rows={4}
                        placeholder="Kerro itsestäsi"
                    />
                </div>

                <h2 className={profileStyles.sectionTitle}>Yhteystiedot</h2>
                <div className={profileStyles.grid}>
                    <div className={profileStyles.fieldGroup}>
                        <h3 className={profileStyles.label}>Sähköposti</h3>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className={formStyles.input}
                            placeholder="Sähköposti"
                        />
                    </div>

                    <div className={profileStyles.fieldGroup}>
                        <h3 className={profileStyles.label}>Puhelinnumero</h3>
                        <input
                            type="tel"
                            name="phoneNumber"
                            value={formData.phoneNumber}
                            onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                            className={formStyles.input}
                            placeholder="Puhelinnumero"
                        />
                    </div>

                    <div className={profileStyles.fieldGroup}>
                        <h3 className={profileStyles.label}>Osoitetiedot</h3>
                        <div className={profileStyles.addressGroup}>
                            <input
                                type="text"
                                name="streetAddress"
                                value={formData.streetAddress}
                                onChange={(e) => setFormData({ ...formData, streetAddress: e.target.value })}
                                className={formStyles.input}
                                placeholder="Katuosoite"
                            />
                            <input
                                type="text"
                                name="postalCode"
                                value={formData.postalCode}
                                onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                                className={formStyles.input}
                                placeholder="Postinumero"
                            />
                            <input
                                type="text"
                                name="city"
                                value={formData.city}
                                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                className={formStyles.input}
                                placeholder="Kaupunki"
                            />
                            <input
                                type="text"
                                name="country"
                                value={formData.country}
                                onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                                className={formStyles.input}
                                placeholder="Maa"
                            />
                        </div>
                    </div>

                    <div className={profileStyles.fieldGroup}>
                        <h3 className={profileStyles.label}>Henkilökohtainen Y-tunnuksesi</h3>
                        <input
                            type="text"
                            name="businessId"
                            value={formData.businessId}
                            onChange={(e) => setFormData({ ...formData, businessId: e.target.value })}
                            className={formStyles.input}
                            placeholder="Y-tunnus"
                        />
                    </div>
                </div>
            </>
            ) : (
            <>
                <div className={profileStyles.fieldGroup}>
                    <h2 className={profileStyles.sectionTitle}>Tietoja sinusta</h2>
                    <p className={profileStyles.bioText}>{taskerDetails?.bio || "Tietoja ei löytynyt"}</p>
                </div>

                <ProfileSkillsSection />

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
    );
}

import { useForm } from "@tanstack/react-form";
import { useUpdateUser } from "../../hooks/userHooks";
import { useCreateTasker, useGetTaskerDetails, useUpdateTaskerDetails } from "../../hooks/taskerHooks";
import type { User, TaskerProfile } from "../../types";
import { profileStyles, buttonStyles, formStyles } from "../../../../ui-library/stylesConfig";
import { useNavigate } from "@tanstack/react-router";

export default function TaskerDetailsEditForm({
    initialValues,
    onSuccess,
    onClose,
}: {
    initialValues?: Partial<User & TaskerProfile>;
    onSuccess?: () => void;
    onClose?: () => void;
}) {
    const navigate = useNavigate();
    const { mutate: updateUser } = useUpdateUser();
    const { mutate: updateTasker } = useUpdateTaskerDetails();
    const { mutate: createTasker } = useCreateTasker();
    const { data: taskerProfile } = useGetTaskerDetails();

    const form = useForm({
        defaultValues: {
            //USER FIELDS
            userName: initialValues?.userName,
            mail: initialValues?.mail,
            businessId: initialValues?.businessId || "",
            phoneNumber: initialValues?.phoneNumber || "",
            address: initialValues?.address || "",

            //TASKER FIELDS
            firstName: initialValues?.firstName || "",
            lastName: initialValues?.lastName || "",
            streetAddress: initialValues?.streetAddress || "",
            postalCode: initialValues?.postalCode || "",
            city: initialValues?.city || "",
            country: initialValues?.country || "",
            bio: initialValues?.bio || "",
            websiteLink: initialValues?.websiteLink || "",
            profileImageUrl: initialValues?.profileImageUrl || "",
        },
        onSubmit: async ({ value }) => {
            try {
                const userUpdate = {
                    userName: initialValues?.userName,
                    mail: initialValues?.mail,
                    businessId: value.businessId,
                    phoneNumber: value.phoneNumber,
                    address: `${value.streetAddress} ${value.postalCode}, ${value.city.toUpperCase()} ${value.country}`,
                };

                const taskerUpdate = {
                    firstName: value.firstName,
                    lastName: value.lastName,
                    streetAddress: value.streetAddress,
                    postalCode: value.postalCode,
                    city: value.city,
                    country: value.country,
                    bio: value.bio,
                    websiteLink: value.websiteLink,
                    profileImageUrl: value.profileImageUrl,
                };

                // Update user
                updateUser(userUpdate, {
                    onSuccess: () => {
                        // Update or create tasker profile
                        if (taskerProfile) {
                            updateTasker(taskerUpdate, {
                                onSuccess: () => {
                                    onSuccess?.();
                                    navigate({ to: "/worker/my-profile/details" });
                                },
                            });
                        } else {
                            createTasker(taskerUpdate, {
                                onSuccess: () => {
                                    onSuccess?.();
                                    navigate({ to: "/worker/my-profile/details" });
                                },
                            });
                        }
                    },
                });
            } catch (error) {
                console.error("Failed to update tasker profile:", error);
            }
        },
    });

    return (
        <div className={profileStyles.container}>
            <div className={profileStyles.header}>
                <h2 className={profileStyles.title}>Muokkaa työntekijäprofiilia</h2>
            </div>

            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    form.handleSubmit();
                }}
            >
                <div className={profileStyles.grid}>
                    <form.Field name="firstName">
                        {(field) => (
                            <div className={profileStyles.fieldGroup}>
                                <label htmlFor={field.name} className={profileStyles.label}>
                                    Etunimi
                                </label>
                                <input
                                    id={field.name}
                                    name={field.name}
                                    value={field.state.value}
                                    onBlur={field.handleBlur}
                                    onChange={(e) => field.handleChange(e.target.value)}
                                    className={formStyles.input}
                                    placeholder="Etunimi"
                                />
                            </div>
                        )}
                    </form.Field>

                    <form.Field name="lastName">
                        {(field) => (
                            <div className={profileStyles.fieldGroup}>
                                <label htmlFor={field.name} className={profileStyles.label}>
                                    Sukunimi
                                </label>
                                <input
                                    id={field.name}
                                    name={field.name}
                                    value={field.state.value}
                                    onBlur={field.handleBlur}
                                    onChange={(e) => field.handleChange(e.target.value)}
                                    className={formStyles.input}
                                    placeholder="Sukunimi"
                                />
                            </div>
                        )}
                    </form.Field>

                    <form.Field name="websiteLink">
                        {(field) => (
                            <div className={profileStyles.fieldGroup}>
                                <label htmlFor={field.name} className={profileStyles.label}>
                                    Verkkosivu linkki
                                </label>
                                <input
                                    id={field.name}
                                    name={field.name}
                                    value={field.state.value}
                                    onBlur={field.handleBlur}
                                    onChange={(e) => field.handleChange(e.target.value)}
                                    className={formStyles.input}
                                    placeholder="https://example.com"
                                />
                            </div>
                        )}
                    </form.Field>
                </div>

                <form.Field name="bio">
                    {(field) => (
                        <div className={profileStyles.fieldGroup}>
                            <h3 className={profileStyles.subsectionTitle}>Tietoja sinusta</h3>
                            <textarea
                                id={field.name}
                                name={field.name}
                                value={field.state.value}
                                onBlur={field.handleBlur}
                                onChange={(e) => field.handleChange(e.target.value)}
                                className={formStyles.textarea}
                                rows={4}
                                placeholder="Kerro itsestäsi"
                            />
                        </div>
                    )}
                </form.Field>

                <h2 className={profileStyles.sectionTitle}>Yhteystiedot</h2>

                <div className={profileStyles.grid}>
                    <form.Field name="phoneNumber">
                        {(field) => (
                            <div className={profileStyles.fieldGroup}>
                                <label htmlFor={field.name} className={profileStyles.label}>
                                    Puhelinnumero
                                </label>
                                <input
                                    id={field.name}
                                    name={field.name}
                                    type="tel"
                                    value={field.state.value}
                                    onBlur={field.handleBlur}
                                    onChange={(e) => field.handleChange(e.target.value)}
                                    className={formStyles.input}
                                    placeholder="Puhelinnumero"
                                />
                            </div>
                        )}
                    </form.Field>

                    <div className={profileStyles.fieldGroup}>
                        <h3 className={profileStyles.label}>Osoite</h3>
                        <div className={profileStyles.addressGroup}>
                            <form.Field name="streetAddress">
                                {(field) => (
                                    <input
                                        id={field.name}
                                        name={field.name}
                                        value={field.state.value}
                                        onBlur={field.handleBlur}
                                        onChange={(e) => field.handleChange(e.target.value)}
                                        className={formStyles.input}
                                        placeholder="Katuosoite"
                                    />
                                )}
                            </form.Field>

                            <form.Field name="postalCode">
                                {(field) => (
                                    <input
                                        id={field.name}
                                        name={field.name}
                                        value={field.state.value}
                                        onBlur={field.handleBlur}
                                        onChange={(e) => field.handleChange(e.target.value)}
                                        className={formStyles.input}
                                        placeholder="Postinumero"
                                    />
                                )}
                            </form.Field>

                            <form.Field name="city">
                                {(field) => (
                                    <input
                                        id={field.name}
                                        name={field.name}
                                        value={field.state.value}
                                        onBlur={field.handleBlur}
                                        onChange={(e) => field.handleChange(e.target.value)}
                                        className={formStyles.input}
                                        placeholder="Kaupunki"
                                    />
                                )}
                            </form.Field>

                            <form.Field name="country">
                                {(field) => (
                                    <input
                                        id={field.name}
                                        name={field.name}
                                        value={field.state.value}
                                        onBlur={field.handleBlur}
                                        onChange={(e) => field.handleChange(e.target.value)}
                                        className={formStyles.input}
                                        placeholder="Maa"
                                    />
                                )}
                            </form.Field>
                        </div>
                    </div>

                    <form.Field name="businessId">
                        {(field) => (
                            <div className={profileStyles.fieldGroup}>
                                <label htmlFor={field.name} className={profileStyles.label}>
                                    Henkilökohtainen Y-tunnuksesi
                                </label>
                                <input
                                    id={field.name}
                                    name={field.name}
                                    value={field.state.value}
                                    onBlur={field.handleBlur}
                                    onChange={(e) => field.handleChange(e.target.value)}
                                    className={formStyles.input}
                                    placeholder="Y-tunnus"
                                />
                            </div>
                        )}
                    </form.Field>
                </div>

                <div className="flex gap-4 mt-6">
                    <button type="submit" className={buttonStyles.saveButton}>
                        Tallenna
                    </button>
                    <button
                        type="button"
                        onClick={() => {
                            onClose?.();
                            navigate({ to: "/worker/my-profile/details" });
                        }}
                        className={buttonStyles.cancelButton}
                    >
                        Peruuta
                    </button>
                </div>
            </form>
        </div>
    );
}

import { useForm } from "@tanstack/react-form";
import { useUpdateUser } from "../../hooks/userHooks";
import { useCreateEmployerProfile, useGetEmployerProfile, useUpdateEmployer } from "../../hooks/EmployerHooks";
import type { UserDto, EmployerProfile } from "../../types";
import { profileStyles, buttonStyles, formStyles } from "../../../../ui-library/stylesConfig";
import { useNavigate } from "@tanstack/react-router";

export default function EmployerDetailsEditForm({
  initialValues,
  onSuccess,
  onClose,
}: {
  initialValues?: Partial<UserDto & EmployerProfile>;
  onSuccess?: () => void;
  onClose?: () => void;
}) {
  const navigate = useNavigate();
  const { mutate: updateUser } = useUpdateUser();
  const { mutate: updateEmployer } = useUpdateEmployer();
  const { mutate: createEmployer } = useCreateEmployerProfile();
  const { data: employerProfile } = useGetEmployerProfile();

  const form = useForm({
    defaultValues: {
      //USER FIELDS
      userName: initialValues?.userName,
      mail: initialValues?.mail,
      personalBusinessId: initialValues?.businessId || "",
      phoneNumber: initialValues?.phoneNumber || "",
      address: initialValues?.address || "",

      //EMPLOYER FIELDS
      firstName: initialValues?.firstName || "",
      lastName: initialValues?.lastName || "",
      employerType: initialValues?.employerType || "",
      streetAddress: initialValues?.streetAddress || "",
      postalCode: initialValues?.postalCode || "",
      city: initialValues?.city || "",
      country: initialValues?.country || "",
      bio: initialValues?.bio || "",
      companyName: initialValues?.companyName || "",
      businessId: initialValues?.businessId || "",
      websiteLink: initialValues?.websiteLink || "",
      profileImageUrl: initialValues?.profileImageUrl || "",
    },
    onSubmit: async ({ value }) => {
      try {
        const userUpdate = {
          userName: initialValues?.userName,
          mail: initialValues?.mail,
          businessId: value.personalBusinessId,
          phoneNumber: value.phoneNumber,
          address: `${value.streetAddress} ${value.postalCode}, ${value.city.toUpperCase()} ${value.country}`,
        };

        const employerUpdate = {
          userId: initialValues?.userName || "",
          firstName: value.firstName,
          lastName: value.lastName,
          employerType: value.employerType,
          streetAddress: value.streetAddress,
          postalCode: value.postalCode,
          city: value.city,
          country: value.country,
          bio: value.bio,
          companyName: value.companyName,
          businessId: value.businessId,
          websiteLink: value.websiteLink,
          profileImageUrl: value.profileImageUrl,
        };

        // Update user
        updateUser(userUpdate, {
          onSuccess: () => {
            // Update or create employer profile
            if (employerProfile) {
              updateEmployer(employerUpdate, {
                onSuccess: () => {
                  onSuccess?.();
                  navigate({ to: "/employer/my-proflie/details" });
                },
              });
            } else {
              createEmployer(employerUpdate, {
                onSuccess: () => {
                  onSuccess?.();
                  navigate({ to: "/employer/my-proflie/details" });
                },
              });
            }
          },
        });
      } catch (error) {
        console.error("Failed to update employer profile:", error);
      }
    },
  });

  return (
    <div className={profileStyles.container}>
      <div className={profileStyles.header}>
        <h2 className={profileStyles.title}>Muokkaa työnantajaprofiilia</h2>
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

          <form.Field name="companyName">
            {(field) => (
              <div className={profileStyles.fieldGroup}>
                <label htmlFor={field.name} className={profileStyles.label}>
                  Yrityksen nimi
                </label>
                <input
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  className={formStyles.input}
                  placeholder="Yrityksen nimi"
                />
              </div>
            )}
          </form.Field>

          <form.Field name="businessId">
            {(field) => (
              <div className={profileStyles.fieldGroup}>
                <label htmlFor={field.name} className={profileStyles.label}>
                  Yrityksesi Y-tunnus
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

          <form.Field name="employerType">
            {(field) => (
              <div className={profileStyles.fieldGroup}>
                <label htmlFor={field.name} className={profileStyles.label}>
                  Työnantaja tyyppi
                </label>
                <select
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  className={formStyles.select}
                >
                  <option value="">Valitse työnantaja tyyppi</option>
                  <option value="INDIVIDUAL">Yksityishenkilö</option>
                  <option value="COMPANY">Yritys</option>
                </select>
              </div>
            )}
          </form.Field>
        </div>

        <form.Field name="bio">
          {(field) => (
            <div className={profileStyles.fieldGroup}>
              <h3 className={profileStyles.subsectionTitle}>Tietoja Yrityksestäsi</h3>
              <textarea
                id={field.name}
                name={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                className={formStyles.textarea}
                rows={4}
                placeholder="Kerro yrityksestäsi"
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

          <form.Field name="personalBusinessId">
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
              navigate({ to: "/employer/my-proflie/details" });
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

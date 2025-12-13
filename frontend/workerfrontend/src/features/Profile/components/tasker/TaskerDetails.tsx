import { Link } from "@tanstack/react-router";
import { profileStyles, buttonStyles } from "../../../../ui-library/stylesConfig";
import type { TaskerProfile, UserDto } from "../../types";
import ProfileSkillsSection from "../UserSkillsSection";

type TaskerDetailsProps = {
    taskerDetails: TaskerProfile | null;
    userDetails: UserDto;
    userEmail: string;
};

export default function TaskerDetails({ taskerDetails, userDetails, userEmail }: TaskerDetailsProps) {
    const tasker = taskerDetails;

    return (
        <div className={profileStyles.container}>
            <div className={profileStyles.header}>
                <h2 className={profileStyles.title}>Työntekijäprofiili</h2>
                <Link to="/worker/my-profile/details/edit" className={buttonStyles.saveButton}>
                    Muokkaa
                </Link>
            </div>

            <h2 className={profileStyles.sectionTitle}>Perustiedot</h2>
            <div className={profileStyles.grid}>
                <div className={profileStyles.fieldGroup}>
                    <h3 className={profileStyles.label}>Nimi</h3>
                    <p className={profileStyles.text}>
                        {tasker?.firstName && tasker?.lastName
                            ? `${tasker.firstName} ${tasker.lastName}`
                            : "Ei asetettu"}
                    </p>
                </div>

                {tasker?.websiteLink && (
                    <div className={profileStyles.fieldGroup}>
                        <h3 className={profileStyles.label}>Verkkosivu</h3>
                        <a
                            href={tasker.websiteLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-green-600 hover:underline"
                        >
                            {tasker.websiteLink}
                        </a>
                    </div>
                )}
            </div>

            <div className={profileStyles.fieldGroup}>
                <h2 className={profileStyles.sectionTitle}>Tietoja sinusta</h2>
                <p className={profileStyles.bioText}>
                    {tasker?.bio ||
                        "Ei vielä lisätty kuvausta. Kerro itsestäsi ja osaamisestasi muokkaamalla profiilia."}
                </p>
            </div>

            <ProfileSkillsSection />

            <h2 className={profileStyles.sectionTitle}>Yhteystiedot</h2>
            <div className={profileStyles.grid}>
                <div className={profileStyles.fieldGroup}>
                    <h3 className={profileStyles.label}>Sähköposti</h3>
                    <p className={profileStyles.text}>{userEmail || "Ei asetettu"}</p>
                </div>

                <div className={profileStyles.fieldGroup}>
                    <h3 className={profileStyles.label}>Puhelinnumero</h3>
                    <p className={profileStyles.text}>{userDetails?.phoneNumber || "Ei asetettu"}</p>
                </div>

                <div className={profileStyles.fieldGroup}>
                    <h3 className={profileStyles.label}>Osoite</h3>
                    <p className={profileStyles.text}>
                        {tasker?.streetAddress && tasker?.postalCode && tasker?.city
                            ? `${tasker.streetAddress}, ${tasker.postalCode} ${tasker.city}${tasker?.country ? ", " + tasker.country : ""}`
                            : "Ei asetettu"}
                    </p>
                </div>
            </div>
        </div>
    );
}

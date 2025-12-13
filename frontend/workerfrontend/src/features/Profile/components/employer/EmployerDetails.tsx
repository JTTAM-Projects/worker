import { Link } from "@tanstack/react-router";
import { profileStyles, buttonStyles } from "../../../../ui-library/stylesConfig";
import type { EmployerProfile, UserDto } from "../../types";

type EmployerDetailsProps = {
    employerDetails: EmployerProfile | null;
    userDetails: UserDto;
    userEmail: string;
};

function employerTypeToFi(type?: string) {
    if (type === "COMPANY") return "Yritys";
    if (type === "INDIVIDUAL") return "Yksityishenkilö";
    return type || "Tietoa ei löytynyt";
}

export default function EmployerDetails({ employerDetails, userDetails, userEmail }: EmployerDetailsProps) {
    const employer = employerDetails;
    const isCompany = employer?.employerType === "COMPANY";

    return (
        <div className={profileStyles.container}>
            <div className={profileStyles.header}>
                <h2 className={profileStyles.title}>Työnantajaprofiili</h2>
                <Link to="/employer/my-proflie/details/edit" className={buttonStyles.saveButton}>
                    Muokkaa
                </Link>
            </div>

            <h2 className={profileStyles.sectionTitle}>Perustiedot</h2>
            <div className={profileStyles.grid}>
                <div className={profileStyles.fieldGroup}>
                    <h3 className={profileStyles.label}>Nimi</h3>
                    <p className={profileStyles.text}>
                        {employer?.firstName && employer?.lastName
                            ? `${employer.firstName} ${employer.lastName}`
                            : "Nimeä ei löytynyt"}
                    </p>
                </div>

                <div className={profileStyles.fieldGroup}>
                    <h3 className={profileStyles.label}>Työnantajatyyppi</h3>
                    <p className={profileStyles.text}>{employerTypeToFi(employer?.employerType)}</p>
                </div>

                {isCompany && (
                    <>
                        <div className={profileStyles.fieldGroup}>
                            <h3 className={profileStyles.label}>Yrityksen nimi</h3>
                            <p className={profileStyles.text}>{employer?.companyName || "Ei asetettu"}</p>
                        </div>

                        <div className={profileStyles.fieldGroup}>
                            <h3 className={profileStyles.label}>Y-tunnus</h3>
                            <p className={profileStyles.text}>{employer?.businessId || "Ei asetettu"}</p>
                        </div>
                    </>
                )}

                {employer?.websiteLink && (
                    <div className={profileStyles.fieldGroup}>
                        <h3 className={profileStyles.label}>Verkkosivu</h3>
                        <a
                            href={employer.websiteLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-green-600 hover:underline"
                        >
                            {employer.websiteLink}
                        </a>
                    </div>
                )}
            </div>

            <div className={profileStyles.fieldGroup}>
                <h3 className={profileStyles.subsectionTitle}>{isCompany ? "Tietoja yrityksestä" : "Tietoja"}</h3>
                <p className={profileStyles.bioText}>
                    {employer?.bio ||
                        "Ei vielä lisätty kuvausta. Lisää kertomalla itsestäsi tai yrityksestäsi muokkaamalla profiilia."}
                </p>
            </div>

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
                        {employer?.streetAddress && employer?.postalCode && employer?.city
                            ? `${employer.streetAddress}, ${employer.postalCode} ${employer.city}${employer?.country ? ", " + employer.country : ""}`
                            : "Ei asetettu"}
                    </p>
                </div>
            </div>
        </div>
    );
}

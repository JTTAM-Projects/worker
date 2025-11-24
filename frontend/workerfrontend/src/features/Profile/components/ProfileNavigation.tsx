import { Link } from "@tanstack/react-router";

interface ProfileNavigationProps {
    type: "employer" | "worker";
}

export default function ProfileNavigation({ type }: ProfileNavigationProps) {
    const basePath = type === "employer" ? "/employer/my-proflie" : "/worker/my-profile";
    const title = type === "employer" ? "Oma työnantaja profiili" : "Oma työntekijä profiili";

    return (
        <>
            <h1 className="text-3xl font-bold mb-8 text-center">{title}</h1>

            <nav className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
                <div className="mb-4">
                    <h2 className="text-lg font-semibold text-gray-900">Profiilisi osiot</h2>
                    <p className="text-sm text-gray-600 mt-1">
                        Hallitse profiilitietojasi, maksutapojasi ja näytä saamasi arvostelut
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Link
                        to={`${basePath}/details` as any}
                        className="flex items-center gap-3 p-4 rounded-lg border-2 transition-all hover:shadow-md"
                        activeProps={{
                            className: "border-green-500 bg-green-50 shadow-md",
                        }}
                        inactiveProps={{
                            className: "border-gray-200 hover:border-green-300 bg-white",
                        }}
                    >
                        <span className="material-icons text-green-600" style={{ fontSize: "28px" }}>
                            person
                        </span>
                        <div className="flex-1">
                            <div className="font-semibold text-gray-900">Profiilitiedot</div>
                            <div className="text-xs text-gray-600">Henkilö- ja yhteystiedot</div>
                        </div>
                    </Link>

                    <Link
                        to={`${basePath}/payments` as any}
                        className="flex items-center gap-3 p-4 rounded-lg border-2 transition-all hover:shadow-md"
                        activeProps={{
                            className: "border-green-500 bg-green-50 shadow-md",
                        }}
                        inactiveProps={{
                            className: "border-gray-200 hover:border-green-300 bg-white",
                        }}
                    >
                        <span className="material-icons text-green-600" style={{ fontSize: "28px" }}>
                            payment
                        </span>
                        <div className="flex-1">
                            <div className="font-semibold text-gray-900">Maksutiedot (Tulossa)</div>
                            <div className="text-xs text-gray-600">Laskutus ja maksutavat</div>
                        </div>
                    </Link>

                    <Link
                        to={`${basePath}/reviews` as any}
                        className="flex items-center gap-3 p-4 rounded-lg border-2 transition-all hover:shadow-md"
                        activeProps={{
                            className: "border-green-500 bg-green-50 shadow-md",
                        }}
                        inactiveProps={{
                            className: "border-gray-200 hover:border-green-300 bg-white",
                        }}
                    >
                        <span className="material-icons text-green-600" style={{ fontSize: "28px" }}>
                            star
                        </span>
                        <div className="flex-1">
                            <div className="font-semibold text-gray-900">Arvostelut</div>
                            <div className="text-xs text-gray-600">Saamasi palautteet</div>
                        </div>
                    </Link>
                </div>
            </nav>
        </>
    );
}

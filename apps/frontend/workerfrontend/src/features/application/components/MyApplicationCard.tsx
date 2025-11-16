interface MyApplicationCardProps {
  application: {
    priceSuggestion: number;
    timeSuggestion: string;
    description?: string;
    applicationStatus: string;
  };
  onEdit: () => void;
  onDelete: () => void;
  isDeleting: boolean;
}

// Displays user's own application with status badge, price suggestion, time details, and description.
// Provides edit and delete actions for managing the application.
export default function MyApplicationCard({
  application,
  onEdit,
  onDelete,
  isDeleting,
}: MyApplicationCardProps) {
  const formatDate = (value: string) => {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
      return value;
    }
    return date.toLocaleDateString("fi-FI", {
      day: "numeric",
      month: "numeric",
      year: "numeric",
    });
  };

  const formatTime = (value: string) => {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
      return value;
    }
    return date.toLocaleTimeString("fi-FI", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const statusVariant = (() => {
    switch (application.applicationStatus) {
      case "ACCEPTED":
        return "bg-blue-100 text-blue-700 border-blue-300";
      case "REJECTED":
        return "bg-red-100 text-red-700 border-red-300";
      case "WITHDRAWN":
        return "bg-gray-100 text-gray-700 border-gray-300";
      default:
        return "bg-green-100 text-green-700 border-green-300";
    }
  })();

  const statusLabel = (() => {
    switch (application.applicationStatus) {
      case "ACCEPTED":
        return "Hyväksytty";
      case "REJECTED":
        return "Hylätty";
      case "WITHDRAWN":
        return "Peruttu";
      default:
        return "Aktiivinen";
    }
  })();

  return (
    <div className="mt-6 bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            Oma hakemus
          </h3>
          <div>
            <span
              className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium ${statusVariant}`}
            >
              {statusLabel}
            </span>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={onEdit}
            className="inline-flex items-center gap-1 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            <span className="material-icons text-sm">edit</span>
            Muokkaa
          </button>
          <button
            onClick={onDelete}
            disabled={isDeleting}
            className="inline-flex items-center gap-1 rounded-lg border border-red-300 bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50"
          >
            <span className="material-icons text-sm">close</span>
            {isDeleting ? "Perutaan..." : "Peru hakemus"}
          </button>
        </div>
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-3">
        <div className="rounded-lg border border-gray-200 p-4">
          <div className="text-xs uppercase tracking-wide text-gray-500">
            Hintaehdotus
          </div>
          <div className="text-2xl font-semibold text-green-600">
            {application.priceSuggestion} €
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 p-4">
          <div className="text-xs uppercase tracking-wide text-gray-500">
            Päivämäärä
          </div>
          <div className="text-lg font-semibold text-gray-800">
            {formatDate(application.timeSuggestion)}
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 p-4">
          <div className="text-xs uppercase tracking-wide text-gray-500">
            Kellonaika
          </div>
          <div className="text-lg font-semibold text-gray-800">
            {formatTime(application.timeSuggestion)}
          </div>
        </div>
      </div>

      <div className="mt-4 border-t border-gray-200 pt-4">
        <div className="text-xs uppercase tracking-wide text-gray-500 mb-1">
          Viesti työnantajalle
        </div>
        <p className="whitespace-pre-line text-gray-700">
          {application.description?.trim() || "Ei lisätietoja"}
        </p>
      </div>
    </div>
  );
}

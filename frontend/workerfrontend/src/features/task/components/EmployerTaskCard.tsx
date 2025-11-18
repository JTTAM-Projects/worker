import type { Task } from "../types";

interface EmployerTaskCardProps {
  task: Task;
  showActions?: boolean;
  onView: () => void;
  onEdit: () => void;
  onDelete: () => void;
  isDeleting: boolean;
}

export default function EmployerTaskCard({
  task,
  showActions = true,
  onView,
  onEdit,
  onDelete,
  isDeleting,
}: EmployerTaskCardProps) {
  const status = getStatusDisplay(task.status);

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

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-semibold text-gray-900">
              {task.title}
            </h2>
            <span
              className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium ${status.className}`}
            >
              {status.label}
            </span>
          </div>

          <div className="mt-3 grid gap-4 text-sm text-gray-600 md:grid-cols-3">
            <div className="flex items-center gap-2">
              <span className="material-icons text-base text-green-500">
                event
              </span>
              <span>
                {formatDate(task.startDate)} – {formatDate(task.endDate)}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="material-icons text-base text-green-500">
                place
              </span>
              <span>
                {task.locations && task.locations.length > 0
                  ? task.locations
                      .map((loc) => {
                        const parts = [loc.streetAddress, loc.city].filter(
                          Boolean
                        );
                        return parts.length > 0
                          ? parts.join(", ")
                          : "Ei sijaintia";
                      })
                      .join(" | ")
                  : "Ei sijaintia"}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="material-icons text-base text-green-500">
                euro
              </span>
              <span>{task.price} €</span>
            </div>
          </div>

          {task.description && (
            <p className="mt-3 line-clamp-2 text-gray-700">
              {task.description}
            </p>
          )}
        </div>

        <div className="flex flex-shrink-0 flex-col gap-2">
          <button
            onClick={onView}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Näytä
          </button>

          {showActions && (
            <>
              <button
                onClick={onEdit}
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Muokkaa
              </button>
              <button
                onClick={onDelete}
                disabled={isDeleting}
                className="rounded-lg border border-red-300 bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isDeleting ? "Poistetaan..." : "Poista"}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function getStatusDisplay(status: Task["status"]) {
  switch (status) {
    case "ACTIVE":
      return {
        label: "Aktiivinen",
        className: "border-grey-300 bg-grey-100 text-green-700",
      };
    case "IN_PROGRESS":
      return {
        label: "Käynnissä",
        className: "border-blue-300 bg-blue-100 text-blue-700",
      };
    case "PENDING_APPROVAL":
      return {
        label: "Odottaa hyväksyntää",
        className: "border-yellow-300 bg-yellow-100 text-yellow-700",
      };
    case "COMPLETED":
      return {
        label: "Valmistunut!",
        className: "border-green-300 bg-green-100 text-green-700",
      };
    case "CANCELLED":
      return {
        label: "Peruttu",
        className: "border-red-300 bg-red-100 text-red-700",
      };
    case "EXPIRED":
      return {
        label: "Vanhentunut",
        className: "border-yellow-300 bg-yellow-100 text-yellow-700",
      };
    default:
      return {
        label: status,
        className: "border-gray-300 bg-gray-100 text-gray-700",
      };
  }
}

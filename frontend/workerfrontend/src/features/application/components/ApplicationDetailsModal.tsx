import { useState } from "react";
import type { TaskApplicationDetails } from "../../task/api/taskApi";

type Props = {
  application: TaskApplicationDetails;
  onClose: () => void;
  onUpdateStatus: (status: "ACCEPTED" | "REJECTED") => void;
  loading?: boolean;
};

// Modal dialog for task owners to view detailed application information and accept/reject applicants.
// Displays applicant profile, rating, message, price suggestion, and provides action buttons for status updates.
export default function ApplicationDetailsModal({ application, onClose, onUpdateStatus, loading }: Props) {
  if (!application) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-lg w-full max-w-xl p-6 mx-4">
        <div className="flex items-start justify-between">
          <h3 className="text-lg font-semibold">Hakemuksen tiedot</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700" aria-label="Sulje">
            <span className="material-icons">close</span>
          </button>
        </div>

        <div className="mt-4 space-y-3">
          <div className="flex items-center gap-4">
            {application.user?.profileImageUrl ? (
              <img
                src={application.user.profileImageUrl}
                alt="avatar"
                className="w-12 h-12 rounded-full object-cover"
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                <span className="material-icons text-gray-600">person</span>
              </div>
            )}

            <div>
              <div className="text-xs text-gray-500">Hakija</div>
              <div className="font-medium text-gray-900">{application.user?.userName}</div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                {typeof application.user?.averageRating === "number" ? (
                  <>
                    <span className="material-icons text-yellow-500 text-base">star</span>
                    <span>{application.user.averageRating.toFixed(1)}</span>
                  </>
                ) : (
                  <span className="text-gray-500">Ei arvosteluja</span>
                )}
              </div>
            </div>

            <div className="ml-auto text-sm">
              {application.applicationStatus === "PENDING" ? (
                <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700 border border-green-300">
                  Active
                </span>
              ) : application.applicationStatus === "ACCEPTED" ? (
                <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700 border border-blue-300">
                  Hyväksytty
                </span>
              ) : application.applicationStatus === "REJECTED" ? (
                <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700 border border-red-300">
                  Hylätty
                </span>
              ) : (
                <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700 border border-gray-300">
                  {application.applicationStatus}
                </span>
              )}
            </div>
          </div>

          <div>
            <div className="text-xs text-gray-500">Hintaehdotus</div>
            <div className="font-medium text-green-600 text-lg">{application.priceSuggestion} €</div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-xs text-gray-500">Aikaehdotus</div>
              <div className="text-gray-900">
                <div className="font-medium">
                  {new Date(application.timeSuggestion)
                    .toLocaleDateString("fi-FI", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })
                    .replace(/^./, (c) => c.toUpperCase())}
                </div>
              </div>
            </div>

            <div>
              <div className="text-xs text-gray-500">Kellonaika</div>
              <div className="text-gray-900">
                <div className="text-sm font-medium">
                  {new Date(application.timeSuggestion).toLocaleTimeString("fi-FI", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
              </div>
            </div>
          </div>

          <div>
            <div className="text-xs text-gray-500">Viesti</div>
            <div className="text-gray-900 whitespace-pre-line">
              {application.description ? (
                application.description
              ) : (
                <span className="text-gray-700">Ei lisätietoja</span>
              )}
            </div>
          </div>

          <div>
            <div className="text-xs text-gray-500">Hakemus jätetty</div>
            <div className="text-gray-700">{new Date(application.createdAt).toLocaleDateString("fi-FI")}</div>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-between pt-8 border-t border-gray-200">
          {application.applicationStatus === "PENDING" ? (
            <>
              <div>
                <ActionGroup actionType="REJECTED" loading={loading} onConfirm={() => onUpdateStatus("REJECTED")} />
              </div>
              <div>
                <ActionGroup actionType="ACCEPTED" loading={loading} onConfirm={() => onUpdateStatus("ACCEPTED")} />
              </div>
            </>
          ) : (
            <div className="w-full text-center py-4">
              {application.applicationStatus === "ACCEPTED" ? (
                <span className="text-green-700 font-semibold">Hakemus on hyväksytty.</span>
              ) : application.applicationStatus === "REJECTED" ? (
                <span className="text-red-700 font-semibold">Hakemus on hylätty.</span>
              ) : null}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ActionGroup({
  actionType,
  onConfirm,
  loading,
}: {
  actionType: "ACCEPTED" | "REJECTED";
  onConfirm: () => void;
  loading?: boolean;
}) {
  const [confirmAction, setConfirmAction] = useState<null | "ACCEPTED" | "REJECTED">(null);
  const isReject = actionType === "REJECTED";

  if (confirmAction === actionType) {
    return (
      <div className="flex flex-col gap-2">
        <span className="text-sm text-gray-700">Haluatko varmasti {isReject ? "hylätä" : "hyväksyä"} hakemuksen?</span>
        <div className="flex gap-2">
          <button
            className={
              isReject
                ? "px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                : "px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            }
            onClick={() => {
              onConfirm();
              setConfirmAction(null);
            }}
            disabled={loading}
          >
            Kyllä, {isReject ? "hylkää" : "hyväksy"}
          </button>
          <button
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
            onClick={() => setConfirmAction(null)}
          >
            Peruuta
          </button>
        </div>
      </div>
    );
  }

  return (
    <button
      className={
        isReject
          ? "px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          : "px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
      }
      onClick={() => setConfirmAction(actionType)}
    >
      {isReject ? "Hylkää" : "Hyväksy"}
    </button>
  );
}

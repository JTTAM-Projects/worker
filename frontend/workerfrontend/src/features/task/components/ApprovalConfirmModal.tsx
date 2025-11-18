import type { Task } from "../types";

interface ApprovalConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  task: Task;
  action: "approve" | "reject";
  isLoading: boolean;
}

export default function ApprovalConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  task,
  action,
  isLoading,
}: ApprovalConfirmModalProps) {
  if (!isOpen) return null;

  const isApprove = action === "approve";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="w-full max-w-lg rounded-lg border border-gray-200 bg-white shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 p-6">
          <div className="flex items-center gap-3">
            <span
              className={`material-icons text-2xl ${
                isApprove ? "text-green-600" : "text-orange-600"
              }`}
            >
              {isApprove ? "check_circle" : "info"}
            </span>
            <h2 className="text-xl font-bold text-gray-800">
              {isApprove ? "Hyväksy työ" : "Hylkää työ"}
            </h2>
          </div>
          <button
            onClick={onClose}
            disabled={isLoading}
            className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <span className="material-icons">close</span>
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="space-y-4">
            <div>
              <p className="text-xs font-medium uppercase text-gray-500">Työ</p>
              <p className="mt-1 text-base font-semibold text-gray-900">
                {task.title}
              </p>
            </div>

            <div>
              <p className="text-xs font-medium uppercase text-gray-500">
                Hinta
              </p>
              <p className="mt-1 text-base font-semibold text-gray-900">
                {task.price} €
              </p>
            </div>

            <div>
              <p className="text-xs font-medium uppercase text-gray-500">
                Työntekijä
              </p>
              <p className="mt-1 text-base font-semibold text-gray-900">
                {task.user?.userName || "Ei tiedossa"}
              </p>
            </div>

            <div className="mt-6 rounded-lg border border-gray-200 bg-gray-50 p-4">
              {isApprove ? (
                <>
                  <p className="mb-3 font-semibold text-gray-800">
                    Hyväksymällä työn:
                  </p>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li className="flex items-start gap-2">
                      <span className="material-icons mt-0.5 text-base text-green-600">
                        check
                      </span>
                      <span>Työntekijälle maksetaan sovittu summa</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="material-icons mt-0.5 text-base text-green-600">
                        check
                      </span>
                      <span>Työtä ei voi enää muokata</span>
                    </li>
                  </ul>
                </>
              ) : (
                <>
                  <p className="mb-3 font-semibold text-gray-800">
                    Hylkäämällä työn:
                  </p>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li className="flex items-start gap-2">
                      <span className="material-icons mt-0.5 text-base text-orange-600">
                        info
                      </span>
                      <span>Työntekijä voi korjata työn</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="material-icons mt-0.5 text-base text-orange-600">
                        info
                      </span>
                      <span>Työntekijä merkitsee työn uudelleen valmiiksi</span>
                    </li>
                  </ul>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-6">
          <div className="flex gap-3">
            <button
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Peruuta
            </button>
            <button
              onClick={onConfirm}
              disabled={isLoading}
              className={`flex-1 rounded-lg px-4 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50 ${
                isApprove
                  ? "bg-green-600 hover:bg-green-700"
                  : "bg-orange-600 hover:bg-orange-700"
              }`}
            >
              {isLoading
                ? "Päivitetään..."
                : isApprove
                  ? "Hyväksy työ"
                  : "Hylkää työ"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

import { useMemo, useState } from 'react';
import type { UpdateApplicationPayload } from '../types';


type Props = {
  application: any;
  onSave: (payload: UpdateApplicationPayload) => Promise<void> | void;
  onDelete: () => Promise<void> | void;
  saving?: boolean;
  deleting?: boolean;
};

const statusBadge = (status?: string) => {
  switch ((status || "").toUpperCase()) {
    case "PENDING":
      return { text: "Aktiivinen", cls: "bg-green-600 text-white" };
    case "ACCEPTED":
      return { text: "Hyväksytty", cls: "bg-blue-600 text-white" };
    case "REJECTED":
      return { text: "Hylätty", cls: "bg-red-600 text-white" };
    default:
      return { text: status || "—", cls: "bg-gray-500 text-white" };
  }
};

export default function ApplicationEditForm({
  application,
  onSave,
  onDelete,
  saving,
  deleting,
}: Props) {
  const initialDate = useMemo(() => {
    try {
      return application?.timeSuggestion
        ? new Date(application.timeSuggestion)
        : null;
    } catch {
      return null;
    }
  }, [application?.timeSuggestion]);

  const [price, setPrice] = useState<string>(
    application?.priceSuggestion != null ? String(application.priceSuggestion) : ""
  );
  const [date, setDate] = useState<string>(
    initialDate ? initialDate.toISOString().slice(0, 10) : ""
  );
  const [time, setTime] = useState<string>(
    initialDate ? initialDate.toISOString().slice(11, 16) : ""
  );
  const [desc, setDesc] = useState<string>(application?.description ?? "");
  const [allowCounterOffers, setAllowCounterOffers] = useState<boolean>(
    Boolean(application?.allowCounterOffers)
  );
  const [allowCalls, setAllowCalls] = useState<boolean>(
    Boolean(application?.allowCalls)
  );

  const badge = statusBadge(application?.applicationStatus);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const iso =
      date && time
        ? new Date(`${date}T${time}:00`).toISOString()
        : undefined;

    await onSave({
      priceSuggestion: price === "" ? undefined : Number(price),
      timeSuggestion: iso,
      description: desc || undefined,
      allowCounterOffers,
      allowCalls,
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white border border-gray-200 rounded-xl p-6 md:p-8"
    >
      <div className="flex items-start justify-end">
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${badge.cls}`}>
          {badge.text}
        </span>
      </div>

      <div className="mt-4 space-y-6">
        {/* Price + checkboxes */}
        <div>
          <label className="block text-sm text-gray-600 mb-1">Hinta €</label>
          <input
            type="number"
            min={0}
            step="1"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full max-w-md border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="Esim. 120"
          />
          <div className="mt-3 flex items-center gap-6">
            <label className="inline-flex items-center gap-2 text-sm text-gray-700">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
                checked={allowCounterOffers}
                onChange={(e) => setAllowCounterOffers(e.target.checked)}
              />
              Vasta-tarjoukset
            </label>
            <label className="inline-flex items-center gap-2 text-sm text-gray-700">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
                checked={allowCalls}
                onChange={(e) => setAllowCalls(e.target.checked)}
              />
              Soitto-mahdollisuus
            </label>
          </div>
        </div>

        {/* Date + time */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-600 mb-1">Päivämäärä</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Kellonaika</label>
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
        </div>

        {/* Free text */}
        <div>
          <label className="block text-sm text-gray-600 mb-1">Lisätietoja</label>
          <textarea
            rows={6}
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="Lisätietoja hakemuksesta..."
          />
        </div>

        {/* Actions */}
        <div className="flex items-center gap-6 pt-4">
          <button
            type="button"
            onClick={onDelete}
            disabled={deleting}
            className="px-6 py-2 rounded-md bg-red-600 text-white hover:bg-red-700 disabled:opacity-60"
          >
            Poista
          </button>
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2 rounded-md bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:opacity-60"
          >
            Muokkaa
          </button>
        </div>
      </div>
    </form>
  );
}
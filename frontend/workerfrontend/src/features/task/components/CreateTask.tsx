import { useState, type ReactNode } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useCreateTask } from "../hooks";
import type { Category } from "../types";
import type { CreateTaskInput } from "../types";

function toLocalIso(d: Date) {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(
    d.getHours(),
  )}:${pad(d.getMinutes())}:00`;
}

type Props = { children: ReactNode };

export default function CreateTask({ children }: Props) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<Category>("Other");
  const [price, setPrice] = useState<number>(50);
  const [startDate, setStartDate] = useState<string>(toLocalIso(new Date()));
  const [endDate, setEndDate] = useState<string>(toLocalIso(new Date(Date.now() + 2 * 60 * 60 * 1000)));
  const [location, setLocation] = useState("Helsinki");
  const [description, setDescription] = useState("");

  const { isAuthenticated, loginWithRedirect } = useAuth0();
  const { mutate, isPending, isError, error } = useCreateTask();

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    const p = Number(price);
    if (Number.isNaN(p) || p < 0) return;

    const payload: CreateTaskInput = {
      title,
      price: p,
      startDate,
      endDate,
      description: description.trim() || undefined,
      categories: [
        {
          title: category,
        },
      ],
      location: {
        streetAddress: "",
        postalCode: "",
        city: location || "Helsinki",
        country: "Suomi",
      },
    };

    mutate(payload, {
      onSuccess: () => {
        setOpen(false);
        setTitle("");
        setDescription("");
      },
    });
  };

  const openDialog: React.MouseEventHandler<HTMLDivElement> = (e) => {
    e.preventDefault();
    if (!isPending) {
      if (!isAuthenticated) {
        void loginWithRedirect({
          appState: { returnTo: window.location.pathname },
        });
        return;
      }
      setOpen(true);
    }
  };

  const openDialogKey: React.KeyboardEventHandler<HTMLDivElement> = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      if (!isPending) {
        if (!isAuthenticated) {
          void loginWithRedirect({
            appState: { returnTo: window.location.pathname },
          });
          return;
        }
        setOpen(true);
      }
    }
  };

  return (
    <>
      <div role="button" tabIndex={0} onClick={openDialog} onKeyDown={openDialogKey} className="inline-block">
        {children}
      </div>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" role="dialog" aria-modal="true">
          <div className="absolute inset-0 bg-black/40" onClick={() => !isPending && setOpen(false)} />
          <div className="relative bg-white rounded-lg shadow-lg w-full max-w-lg p-6">
            <h2 className="text-xl font-bold mb-4">Luo uusi tehtävä</h2>

            <form onSubmit={onSubmit} className="space-y-4">
              <div>
                <label htmlFor="title" className="block text-sm font-medium mb-1">
                  Otsikko
                </label>
                <input
                  id="title"
                  className="w-full border rounded-md px-3 py-2"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  placeholder="Syötä otsikko"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="category" className="block text-sm font-medium mb-1">
                    Kategoria
                  </label>
                  <select
                    id="category"
                    className="w-full border rounded-md px-3 py-2"
                    value={category}
                    onChange={(e) => setCategory(e.target.value as Category)}
                  >
                    <option value="Cleaning">Cleaning</option>
                    <option value="Garden">Garden</option>
                    <option value="Moving">Moving</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="price" className="block text-sm font-medium mb-1">
                    Hinta (€)
                  </label>
                  <input
                    id="price"
                    type="number"
                    min={0}
                    className="w-full border rounded-md px-3 py-2"
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    required
                    placeholder="Syötä hinta (€)"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="startDate" className="block text-sm font-medium mb-1">
                    Alkaa
                  </label>
                  <input
                    id="startDate"
                    type="datetime-local"
                    className="w-full border rounded-md px-3 py-2"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="endDate" className="block text-sm font-medium mb-1">
                    Päättyy
                  </label>
                  <input
                    id="endDate"
                    type="datetime-local"
                    className="w-full border rounded-md px-3 py-2"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="location" className="block text-sm font-medium mb-1">
                  Sijainti
                </label>
                <input
                  id="location"
                  className="w-full border rounded-md px-3 py-2"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  required
                  placeholder="Syötä sijainti"
                />
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium mb-1">
                  Kuvaus (valinnainen)
                </label>
                <textarea
                  id="description"
                  className="w-full border rounded-md px-3 py-2"
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Kuvaile tehtävää"
                />
              </div>

              {isError && (
                <p className="text-red-600 text-sm">
                  {error instanceof Error ? error.message : "Tehtävän luonti epäonnistui"}
                </p>
              )}

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  className="px-4 py-2 rounded-md border hover:bg-gray-50"
                  onClick={() => !isPending && setOpen(false)}
                  disabled={isPending}
                >
                  Peruuta
                </button>
                <button
                  type="submit"
                  className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 disabled:opacity-60"
                  disabled={isPending}
                >
                  {isPending ? "Luodaan..." : "Luo tehtävä"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

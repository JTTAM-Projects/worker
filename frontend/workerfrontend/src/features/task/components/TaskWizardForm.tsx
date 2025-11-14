import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth0 } from "@auth0/auth0-react";
import type { CategoryResponse } from "../../task/types";
import type { TaskCategoryInput, TaskLocationInput } from "../api/taskApi";

type Step = 0 | 1 | 2;

export type SubmissionState = "idle" | "loading" | "success" | "error";

export type TaskFormState = {
  title: string;
  description: string;
  categoryTitle: string;
  price: string;
  startDate: string;
  endDate: string;
  streetAddress: string;
  postalCode: string;
  city: string;
  country: string;
};

export type ContactFormState = {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
};

const STEP_LABELS = ["Ilmoituksen tiedot", "Yhteystiedot", "Viimeistely"] as const;

const datetimeLocalString = (date: Date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}T${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;

const defaultTaskValues = (): TaskFormState => {
  const now = new Date();
  const later = new Date(now.getTime() + 2 * 60 * 60 * 1000);
  return {
    title: "",
    description: "",
    categoryTitle: "",
    price: "",
    startDate: datetimeLocalString(now),
    endDate: datetimeLocalString(later),
    streetAddress: "",
    postalCode: "",
    city: "",
    country: "Suomi",
  };
};

const defaultContactValues = (): ContactFormState => ({
  firstName: "",
  lastName: "",
  phoneNumber: "",
  email: "",
});

export type TaskWizardPayload = {
  task: TaskFormState;
  contact: ContactFormState;
  categories: TaskCategoryInput[];
  location: TaskLocationInput;
};

type TaskWizardFormProps = {
  mode: "create" | "edit";
  onCancel: () => void;
  onSubmit: (payload: TaskWizardPayload) => Promise<void> | void;
  isSubmitting: boolean;
  submissionState: SubmissionState;
  submissionError?: string | null;
  submitLabel: string;
  successMessage?: string;
  initialTask?: Partial<TaskFormState>;
  initialContact?: Partial<ContactFormState>;
};

export function TaskWizardForm({
  mode,
  onCancel,
  onSubmit,
  isSubmitting,
  submissionState,
  submissionError,
  submitLabel,
  successMessage,
  initialTask,
  initialContact,
}: TaskWizardFormProps) {
  const { isAuthenticated, getAccessTokenSilently } = useAuth0();
  const [step, setStep] = useState<Step>(0);
  const [taskForm, setTaskForm] = useState<TaskFormState>(defaultTaskValues);
  const [contactForm, setContactForm] = useState<ContactFormState>(defaultContactValues);

  const cardClass = "bg-white p-6 rounded-lg shadow-sm border border-gray-200 space-y-4";
  const inputClass =
    "mt-1 w-full rounded-md border border-gray-300 bg-gray-50 px-4 py-3 focus:border-green-500 focus:ring-green-500";
  const labelClass = "block text-sm font-medium text-gray-600";

  const locationFields: Array<{
    label: string;
    name: keyof TaskFormState;
    placeholder: string;
  }> = [
    {
      label: "Katuosoite",
      name: "streetAddress",
      placeholder: "Esim. Testitie 1",
    },
    {
      label: "Postinumero",
      name: "postalCode",
      placeholder: "Esim. 00100",
    },
    {
      label: "Kaupunki",
      name: "city",
      placeholder: "Esim. Helsinki",
    },
    {
      label: "Maa",
      name: "country",
      placeholder: "Esim. Suomi",
    },
  ];

  const contactFields: Array<{
    label: string;
    name: keyof ContactFormState;
    placeholder: string;
    type: "text" | "tel" | "email";
  }> = [
    { label: "Etunimi", name: "firstName", placeholder: "Etunimi", type: "text" },
    { label: "Sukunimi", name: "lastName", placeholder: "Sukunimi", type: "text" },
    {
      label: "Puhelinnumero",
      name: "phoneNumber",
      placeholder: "Esim. 0401234567",
      type: "tel",
    },
    {
      label: "Sähköposti",
      name: "email",
      placeholder: "esimerkki@posti.com",
      type: "email",
    },
  ];

  useEffect(() => {
    if (initialTask) {
      setTaskForm((prev) => ({
        ...prev,
        ...initialTask,
        startDate: initialTask.startDate ?? prev.startDate,
        endDate: initialTask.endDate ?? prev.endDate,
      }));
    }
  }, [initialTask]);

  useEffect(() => {
    if (initialContact) {
      setContactForm((prev) => ({
        ...prev,
        ...initialContact,
      }));
    }
  }, [initialContact]);

  const { data: categories, isLoading: categoriesLoading } = useQuery<
    Array<CategoryResponse & { categoryId?: number }>
  >({
    queryKey: ["categories"],
    queryFn: async () => {
      const token = await getAccessTokenSilently();
      const res = await fetch("http://localhost:8080/api/categories", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) {
        throw new Error("Kategorioiden lataus epäonnistui");
      }
      return res.json();
    },
    enabled: isAuthenticated,
  });

  const selectedCategory = useMemo(() => {
    if (!taskForm.categoryTitle) return undefined;
    return categories?.find((cat) => cat.title.toLowerCase() === taskForm.categoryTitle.toLowerCase());
  }, [categories, taskForm.categoryTitle]);

  const isStepOneValid =
    Boolean(taskForm.title.trim()) &&
    Boolean(taskForm.description.trim()) &&
    Boolean(taskForm.categoryTitle.trim()) &&
    Boolean(taskForm.price.trim()) &&
    !Number.isNaN(Number(taskForm.price)) &&
    Boolean(taskForm.city.trim()) &&
    Boolean(taskForm.country.trim()) &&
    Boolean(taskForm.streetAddress.trim()) &&
    Boolean(taskForm.postalCode.trim()) &&
    Boolean(taskForm.startDate) &&
    Boolean(taskForm.endDate);

  const isStepTwoValid =
    Boolean(contactForm.firstName.trim()) &&
    Boolean(contactForm.lastName.trim()) &&
    Boolean(contactForm.phoneNumber.trim()) &&
    Boolean(contactForm.email.trim());

  const handleNext = () => {
    if (step === 0 && !isStepOneValid) return;
    if (step === 1 && !isStepTwoValid) return;
    setStep((prev) => (prev === 2 ? 2 : ((prev + 1) as Step)));
  };

  const handlePrevious = () => {
    setStep((prev) => (prev === 0 ? 0 : ((prev - 1) as Step)));
  };

  const handleSubmit = async () => {
    const categoriesPayload: TaskCategoryInput[] = selectedCategory
      ? [
          {
            title: selectedCategory.title,
            categoryId:
              "categoryId" in selectedCategory ? (selectedCategory.categoryId as number | undefined) : undefined,
          },
        ]
      : taskForm.categoryTitle
        ? [
            {
              title: taskForm.categoryTitle,
            },
          ]
        : [];

    const payload: TaskWizardPayload = {
      task: taskForm,
      contact: contactForm,
      categories: categoriesPayload,
      location: {
        streetAddress: taskForm.streetAddress.trim(),
        postalCode: taskForm.postalCode.trim(),
        city: taskForm.city.trim(),
        country: taskForm.country.trim(),
      },
    };

    await onSubmit(payload);
  };

  const StepIndicator = () => (
    <div className="flex items-center justify-center gap-6 py-6">
      {STEP_LABELS.map((label, index) => {
        const isActive = index === step;
        const isCompleted = index < step;
        return (
          <div key={label} className="flex items-center gap-2 text-sm font-medium text-gray-600">
            <div
              className={`flex h-10 w-10 items-center justify-center rounded-full border-2 transition-colors ${
                isActive
                  ? "border-green-500 bg-green-500 text-white"
                  : isCompleted
                    ? "border-green-400 bg-green-100 text-green-700"
                    : "border-gray-300 bg-white text-gray-500"
              }`}
            >
              {index + 1}
            </div>
            <span className={`hidden sm:inline ${isActive ? "text-green-600" : "text-gray-600"}`}>{label}</span>
          </div>
        );
      })}
    </div>
  );

  const renderTaskStep = () => (
    <div className="space-y-8">
      <section>
        <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Ilmoituksen tiedot</h2>

        <div className="grid gap-8 md:grid-cols-2">
          <div className="space-y-6">
            <div className={cardClass}>
              <h3 className="text-lg font-semibold text-gray-700">Työtehtävä</h3>
              <div className="space-y-4">
                <label className={labelClass}>
                  Otsikko
                  <input
                    type="text"
                    value={taskForm.title}
                    onChange={(e) =>
                      setTaskForm((prev) => ({
                        ...prev,
                        title: e.target.value,
                      }))
                    }
                    className={inputClass}
                    placeholder="Esim. Pihan kevätsiivous"
                  />
                </label>
                <label className={labelClass}>
                  Kuvaus
                  <textarea
                    value={taskForm.description}
                    onChange={(e) =>
                      setTaskForm((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                    className={inputClass}
                    rows={4}
                    placeholder="Kuvaile tehtävän työtehtävät ja aikataulu."
                  />
                </label>
                <label className={labelClass}>
                  Kategoria
                  <select
                    value={taskForm.categoryTitle}
                    onChange={(e) =>
                      setTaskForm((prev) => ({
                        ...prev,
                        categoryTitle: e.target.value,
                      }))
                    }
                    className={inputClass}
                    disabled={categoriesLoading}
                  >
                    <option value="">Valitse kategoria</option>
                    {categories?.map((category) => (
                      <option key={category.title} value={category.title}>
                        {category.title}
                      </option>
                    ))}
                  </select>
                </label>
                <label className={labelClass}>
                  Hinta (€)
                  <input
                    type="number"
                    min={0}
                    value={taskForm.price}
                    onChange={(e) =>
                      setTaskForm((prev) => ({
                        ...prev,
                        price: e.target.value,
                      }))
                    }
                    className={inputClass}
                    placeholder="Esim. 120"
                  />
                </label>
              </div>
            </div>

            <div className={cardClass}>
              <h3 className="text-lg font-semibold text-gray-700">Aikataulu</h3>
              <div className="space-y-4">
                <label className={labelClass}>
                  Alkamisaika
                  <input
                    type="datetime-local"
                    value={taskForm.startDate}
                    onChange={(e) =>
                      setTaskForm((prev) => ({
                        ...prev,
                        startDate: e.target.value,
                      }))
                    }
                    className={inputClass}
                  />
                </label>
                <label className={labelClass}>
                  Päättymisaika
                  <input
                    type="datetime-local"
                    value={taskForm.endDate}
                    onChange={(e) =>
                      setTaskForm((prev) => ({
                        ...prev,
                        endDate: e.target.value,
                      }))
                    }
                    className={inputClass}
                  />
                </label>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className={cardClass}>
              <h3 className="text-lg font-semibold text-gray-700">Sijainti</h3>
              {locationFields.map(({ label, name, placeholder }) => (
                <label key={name} className={labelClass}>
                  {label}
                  <input
                    type="text"
                    value={taskForm[name] as string}
                    onChange={(e) =>
                      setTaskForm((prev) => ({
                        ...prev,
                        [name]: e.target.value,
                      }))
                    }
                    className={inputClass}
                    placeholder={placeholder}
                  />
                </label>
              ))}
            </div>

            <div className={cardClass.replace(" space-y-4", "")}>
              <h3 className="text-lg font-semibold text-gray-700 mb-3">Lisää kuvia (valinnainen)</h3>
              <div className="flex flex-col items-center justify-center gap-4 rounded-md border-2 border-dashed border-gray-300 bg-gray-50 py-10 text-center text-gray-600">
                <p>Raahaa ja pudota kuvia tähän tai valitse ne tietokoneeltasi.</p>
                <button
                  type="button"
                  className="rounded-md border border-gray-300 px-5 py-2 text-sm font-medium text-gray-600 hover:border-green-500 hover:text-green-600"
                >
                  Valitse tiedostot
                </button>
              </div>
              <p className="mt-3 text-xs text-gray-500">
                Kuvien lisääminen on valinnaista. Tuettuja formaatteja ovat JPEG- ja PNG-tiedostot.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );

  const renderContactStep = () => (
    <div className="space-y-8">
      <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Yhteystiedot</h2>

      <div className="max-w-3xl mx-auto space-y-6 bg-white p-8 rounded-lg shadow-sm border border-gray-200">
        <div className="grid gap-6 md:grid-cols-2">
          {contactFields.map(({ label, name, placeholder, type }) => (
            <label key={name} className={labelClass}>
              {label}
              <input
                type={type}
                value={contactForm[name] as string}
                onChange={(e) =>
                  setContactForm((prev) => ({
                    ...prev,
                    [name]: e.target.value,
                  }))
                }
                className={inputClass}
                placeholder={placeholder}
              />
            </label>
          ))}
        </div>
        <p className="text-sm text-gray-500">
          Näitä tietoja käytetään yhteydenottoon työntekijöihin sekä ilmoituksen hallintaan.
        </p>
      </div>
    </div>
  );

  const renderReviewStep = () => (
    <div className="space-y-10">
      <h2 className="text-3xl font-bold text-gray-800 text-center">Viimeistely</h2>
      <p className="text-center text-gray-600 max-w-2xl mx-auto">
        Tarkista ilmoituksen tiedot ennen {mode === "create" ? "julkaisua" : "päivitystä"}. Voit palata edellisiin
        vaiheisiin tarvittaessa.
      </p>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4 bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-700">Työtehtävän tiedot</h3>
          <ReviewRow label="Otsikko" value={taskForm.title} />
          <ReviewRow label="Kuvaus" value={taskForm.description} />
          <ReviewRow label="Kategoria" value={taskForm.categoryTitle} />
          <ReviewRow label="Hinta" value={`${taskForm.price} €`} />
          <ReviewRow
            label="Aikaväli"
            value={`${new Date(taskForm.startDate).toLocaleString("fi-FI")} – ${new Date(taskForm.endDate).toLocaleString("fi-FI")}`}
          />
        </div>

        <div className="space-y-4 bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-700">Sijainti</h3>
          <ReviewRow label="Katuosoite" value={taskForm.streetAddress} />
          <ReviewRow label="Postinumero" value={taskForm.postalCode} />
          <ReviewRow label="Kaupunki" value={taskForm.city} />
          <ReviewRow label="Maa" value={taskForm.country} />
        </div>

        <div className="space-y-4 bg-white p-6 rounded-lg shadow-sm border border-gray-200 md:col-span-2">
          <h3 className="text-lg font-semibold text-gray-700">Yhteystiedot</h3>
          <div className="grid gap-4 md:grid-cols-2">
            <ReviewRow label="Etunimi" value={contactForm.firstName} />
            <ReviewRow label="Sukunimi" value={contactForm.lastName} />
            <ReviewRow label="Puhelin" value={contactForm.phoneNumber} />
            <ReviewRow label="Sähköposti" value={contactForm.email} />
          </div>
        </div>
      </div>

      {submissionState === "success" && successMessage && (
        <div className="rounded-lg border border-green-300 bg-green-50 px-6 py-4 text-green-700 text-center">
          {successMessage}
        </div>
      )}

      {submissionState === "error" && submissionError && (
        <div className="rounded-lg border border-red-300 bg-red-50 px-6 py-4 text-red-700 text-center">
          {submissionError}
        </div>
      )}
    </div>
  );

  const renderContent = () => {
    switch (step) {
      case 0:
        return renderTaskStep();
      case 1:
        return renderContactStep();
      case 2:
        return renderReviewStep();
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="container mx-auto px-6 py-10">
        <h1 className="text-4xl font-bold text-gray-800 text-center">
          {mode === "create" ? "Luo uusi työilmoitus" : "Muokkaa työilmoitusta"}
        </h1>
        <StepIndicator />

        <div className="mt-6">{renderContent()}</div>

        <div className="mt-12 flex flex-col-reverse items-center justify-between gap-4 border-t border-gray-200 pt-6 sm:flex-row">
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onCancel}
              className="rounded-md border border-gray-300 px-5 py-2 text-sm font-medium text-gray-600 hover:border-green-500 hover:text-green-600"
            >
              Peruuta
            </button>
            {step > 0 && (
              <button
                type="button"
                onClick={handlePrevious}
                className="rounded-md border border-gray-300 px-5 py-2 text-sm font-medium text-gray-600 hover:border-green-500 hover:text-green-600"
              >
                Edellinen
              </button>
            )}
          </div>

          <div className="flex gap-3">
            {step < 2 && (
              <button
                type="button"
                onClick={handleNext}
                disabled={(step === 0 && !isStepOneValid) || (step === 1 && !isStepTwoValid)}
                className={`rounded-md px-6 py-2 text-sm font-semibold transition-colors ${
                  (step === 0 && !isStepOneValid) || (step === 1 && !isStepTwoValid)
                    ? "bg-gray-300 text-white"
                    : "bg-green-500 text-white hover:bg-green-600"
                }`}
              >
                Jatka
              </button>
            )}

            {step === 2 && (
              <button
                type="button"
                onClick={() => void handleSubmit()}
                disabled={isSubmitting}
                className="rounded-md bg-green-500 px-6 py-2 text-sm font-semibold text-white transition-colors hover:bg-green-600 disabled:cursor-not-allowed disabled:bg-green-300"
              >
                {isSubmitting ? "Tallennetaan..." : submitLabel}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

const ReviewRow = ({ label, value }: { label: string; value: string }) => (
  <div>
    <span className="block text-xs uppercase tracking-wide text-gray-500">{label}</span>
    <span className="mt-1 block rounded-md border border-gray-200 bg-gray-50 px-4 py-2 text-sm text-gray-700">
      {value || "—"}
    </span>
  </div>
);

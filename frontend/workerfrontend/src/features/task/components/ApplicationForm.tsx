import { useEffect, useMemo, useState } from "react";
import { useForm } from "@tanstack/react-form";

type ApplicationFormMode = "create" | "edit";

export interface ApplicationFormValues {
  priceSuggestion: number;
  timeSuggestion: string;
  description?: string;
}

interface ApplicationFormProps {
  taskPrice: number;
  mode?: ApplicationFormMode;
  initialValues?: ApplicationFormValues;
  submitLabel?: string;
  onSubmit: (values: ApplicationFormValues) => Promise<void>;
  onSuccess?: () => void;
  onCancel: () => void;
}

export default function ApplicationForm({
  taskPrice,
  mode = "create",
  initialValues,
  submitLabel,
  onSubmit,
  onSuccess,
  onCancel,
}: ApplicationFormProps) {
  const [submitError, setSubmitError] = useState<string | null>(null);

  const defaultValues = useMemo(
    () => ({
      priceSuggestion: initialValues
        ? String(initialValues.priceSuggestion)
        : "",
      timeSuggestion: initialValues?.timeSuggestion
        ? toDateTimeLocal(initialValues.timeSuggestion)
        : "",
      description: initialValues?.description ?? "",
    }),
    [initialValues]
  );

  const form = useForm({
    defaultValues,
    onSubmit: async ({ value }) => {
      try {
        setSubmitError(null);
        const applicationData: ApplicationFormValues = {
          priceSuggestion: Number(value.priceSuggestion),
          timeSuggestion: value.timeSuggestion,
          description: value.description?.trim() || undefined,
        };

        await onSubmit(applicationData);

        if (mode === "create") {
          form.reset(defaultValues);
        }

        onSuccess?.();
      } catch (error) {
        console.error("Error submitting application:", error);
        setSubmitError(
          error instanceof Error
            ? error.message
            : "Hakemuksen lähetys epäonnistui"
        );
        throw error;
      }
    },
  });

  useEffect(() => {
    form.reset(defaultValues);
  }, [defaultValues, form]);

  return (
    <div className="mt-6 bg-gray-50 border border-gray-200 rounded-lg p-6">
      <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
        <span className="material-icons text-green-600">description</span>
        {mode === "edit" ? "Muokkaa hakemusta" : "Lähetä hakemus"}
      </h3>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
        className="space-y-4"
      >
        {submitError && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-start gap-2">
            <span className="material-icons text-red-600 text-xl">error</span>
            <div>
              <p className="font-medium">Virhe hakemuksen lähetyksessä</p>
              <p className="text-sm">{submitError}</p>
            </div>
          </div>
        )}

        {form.state.submissionAttempts > 0 && form.state.errors.length > 0 && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-start gap-2">
            <span className="material-icons text-red-600 text-xl">error</span>
            <div>
              <p className="font-medium">Virhe hakemuksen lähetyksessä</p>
              <p className="text-sm">{form.state.errors.join(", ")}</p>
            </div>
          </div>
        )}

        <form.Field
          name="priceSuggestion"
          validators={{
            onChange: ({ value }) => {
              if (!value) return "Hintatarjous vaaditaan";
              if (Number(value) <= 0)
                return "Hinnan täytyy olla suurempi kuin 0";
              return undefined;
            },
          }}
        >
          {(field) => (
            <div>
              <label
                htmlFor="priceSuggestion"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Hintatarjous (€) *
              </label>
              <input
                type="number"
                id="priceSuggestion"
                name="priceSuggestion"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                min="0"
                step="0.01"
                placeholder="Esim. 50"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
              {field.state.meta.errors.length > 0 && (
                <p className="text-xs text-red-600 mt-1">
                  {field.state.meta.errors.join(", ")}
                </p>
              )}
              <p className="text-xs text-gray-500 mt-1">
                Työn hintatarjous: {taskPrice} €
              </p>
            </div>
          )}
        </form.Field>

        <form.Field
          name="timeSuggestion"
          validators={{
            onChange: ({ value }) =>
              !value ? "Aikaehdotus vaaditaan" : undefined,
          }}
        >
          {(field) => (
            <div>
              <label
                htmlFor="timeSuggestion"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Aikaehdotus *
              </label>
              <input
                type="datetime-local"
                id="timeSuggestion"
                name="timeSuggestion"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
              {field.state.meta.errors.length > 0 && (
                <p className="text-xs text-red-600 mt-1">
                  {field.state.meta.errors.join(", ")}
                </p>
              )}
              <p className="text-xs text-gray-500 mt-1">
                Milloin voisit tehdä työn?
              </p>
            </div>
          )}
        </form.Field>

        <form.Field name="description">
          {(field) => (
            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Lisätiedot
              </label>
              <textarea
                id="description"
                name="description"
                rows={4}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                placeholder="Kerro miksi sinä sopisi tähän työhön, kokemuksestasi tai muita hyödyllisiä tietoja..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
              />
            </div>
          )}
        </form.Field>

        <div className="flex gap-3 pt-2">
          <button
          type="submit"
          disabled={form.state.isSubmitting}
          className="flex-1 px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-green-600"
        >
          {form.state.isSubmitting ? (
              <>
                <span className="material-icons animate-spin">refresh</span>
                Lähetetään...
              </>
            ) : (
              <>
                <span className="material-icons">send</span>
                {submitLabel ?? (mode === "edit" ? "Tallenna muutokset" : "Lähetä hakemus")}
              </>
            )}
          </button>
          <button
            type="button"
            onClick={onCancel}
            disabled={form.state.isSubmitting}
            className="px-6 py-3 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Peruuta
          </button>
        </div>
      </form>
    </div>
  );
}

function toDateTimeLocal(value: string) {
  if (!value) return "";
  if (value.length >= 16) {
    return value.slice(0, 16);
  }
  return value;
}

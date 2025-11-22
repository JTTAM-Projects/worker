import { useForm, type AnyFieldApi } from "@tanstack/react-form";
import type { CreateReviewProps } from "../types";


function FieldInfo({ field }: { field: AnyFieldApi }) {
  return (
    <>
      {field.state.meta.isTouched && !field.state.meta.isValid ? (
        <em>{field.state.meta.errors.join(', ')}</em>
      ) : null}
      {field.state.meta.isValidating ? 'Validating...' : null}
    </>
  )
}

export default function CreateReviewForm({taskId, revieweeUsername, submitRoute, cancelRoute
}: CreateReviewProps) {

  const form = useForm({
    defaultValues: {
      taskId: taskId,
      revieweeUsername: revieweeUsername,
      rating: 0,
      comment: ""
    },
    onSubmit: async () => {
      console.log(`hello + ${submitRoute}`)
    },
  });

  const onCancel = async () => {
    console.log(`hello + ${cancelRoute}`)
  }

  return (
    <div className="mt-6 bg-gray-50 border border-gray-200 rounded-lg p-6">
      <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
        <span className="material-icons text-green-600">rate_review</span>
        Anna palautetta
      </h3>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
        className="space-y-4"
      >

        <form.Field
          name="rating"
          validators={{
            onChange: ({ value }) => {
              if (value === undefined || value === null)
                return "Arvosana vaaditaan";
              if (Number(value) < 1 || Number(value) > 5)
                return "Arvosanan tulee olla 1–5";
              return undefined;
            },
          }}
          children={(field) => (
            <>
              <label
                htmlFor="rating"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Arvosana (1–5) *
              </label>
              <input
                type="number"
                id="rating"
                name="rating"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(parseInt(e.target.value))}
                min="1"
                max="5"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
              <FieldInfo field={field}/>
            </>
          )}
          />

        <form.Field name="comment"
        children=
          {(field) => (
            <div>
              <label
                htmlFor="comment"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Kommentti
              </label>
              <textarea
                id="comment"
                name="comment"
                rows={4}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                placeholder="Kirjoita palautteesi tähän..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
              />
            </div>
          )}
        />

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
                Lähetä arvostelu
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

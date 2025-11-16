import type { Task, CategoryResponse } from "../types";

interface TaskDetailsProps {
  task: Task;
  description?: string;
  categories?: CategoryResponse[];
  getCategoryIcon?: (categoryTitle: string) => string;
}

export default function TaskDetails({
  task,
  description,
  categories,
  getCategoryIcon,
}: TaskDetailsProps) {
  const formatDate = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleDateString("fi-FI", {
      day: "numeric",
      month: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="flex flex-col md:flex-row gap-6">
      <div className="flex-1 space-y-6">
        {/* Image Placeholder */}
        <div className="bg-gray-200 border border-gray-300 rounded-lg overflow-hidden h-96">
          <div className="h-full flex items-center justify-center">
            <div className="text-center text-gray-500">
              <span className="material-icons text-4xl mb-1">image</span>
              <p className="text-xs">Kuva tulossa</p>
            </div>
          </div>
        </div>
        {description && (
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-start justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <span className="material-icons text-gray-600 text-xl">
                  description
                </span>
                Kuvaus
              </h2>
              {categories && categories.length > 0 && (
                <div className="flex items-center gap-2">
                  {categories.map((cat, index) => (
                    <span
                      key={index}
                      className="flex items-center gap-1 bg-gray-100 px-3 py-1 rounded-full text-gray-700"
                    >
                      {getCategoryIcon && (
                        <span className="material-icons text-base">
                          {getCategoryIcon(cat.title)}
                        </span>
                      )}
                      <span className="font-medium text-xs">{cat.title}</span>
                    </span>
                  ))}
                </div>
              )}
            </div>
            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
              {description}
            </p>
          </div>
        )}
      </div>

      <div className="w-full md:w-[320px] flex-shrink-0 space-y-3">
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <span className="material-icons text-gray-600 text-xl">event</span>
            <div className="flex-1">
              <div className="text-gray-700 font-medium mb-1">Päivämäärä</div>
              <div className="text-gray-600">
                {formatDate(task.startDate)}-{formatDate(task.endDate)}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <span className="material-icons text-gray-600 text-xl">place</span>
            <div className="flex-1">
              <div className="text-gray-700 font-medium mb-1">Sijainti</div>
              {task.location ? (
                <div className="text-gray-600">
                  {task.location.streetAddress && (
                    <div>{task.location.streetAddress}</div>
                  )}
                  {task.location.postalCode && task.location.city && (
                    <div>
                      {task.location.postalCode} {task.location.city}
                    </div>
                  )}
                  {!task.location.streetAddress && !task.location.city && (
                    <div className="italic">Ei tarkkaa sijaintia</div>
                  )}
                </div>
              ) : (
                <div className="text-gray-600 italic">Ei sijaintitietoja</div>
              )}
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <span className="material-icons text-gray-600 text-xl">person</span>
            <div className="flex-1">
              <div className="text-gray-700 font-medium mb-1">Työnantaja</div>
              <div className="space-y-2">
                <div className="text-gray-800 font-medium">
                  {task.user.userName}
                </div>
                {task.user.mail && (
                  <a
                    href={`mailto:${task.user.mail}`}
                    className="text-blue-600 hover:underline text-sm block"
                  >
                    {task.user.mail}
                  </a>
                )}
                <div className="pt-2 border-t border-gray-200">
                  <div className="flex items-center gap-2 text-sm">
                    <span className="material-icons text-yellow-500 text-base">
                      star
                    </span>
                    <span className="text-gray-600 italic">
                      Arvosteluja ei vielä saatavilla
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <span className="text-gray-700 font-medium">Palkkio</span>
            <span className="text-green-600 text-2xl font-bold">
              {task.price} €
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

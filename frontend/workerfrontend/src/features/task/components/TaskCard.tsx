import type { Task, LocationResponse } from "../types";
import { useNavigate } from "@tanstack/react-router";
import { useMemo, useCallback, type KeyboardEvent } from "react";

// --- Helper Functions & Constants (Moved Outside Component) ---

/**
 * A map to store category icons.
 */
const CATEGORY_ICON_MAP: Record<string, string> = {
  "GARDEN": "yard",
  "CLEANING": "cleaning_services",
  "MOVING": "local_shipping",
  "HOUSEHOLD": "home",
  "REPAIR": "build",
  "PAINTING": "format_paint",
  "SNOW REMOVAL": "ac_unit",
  "FOREST WORK": "park",
  "YARD": "grass",
  "OTHER": "handyman",
};
const DEFAULT_ICON = "work";

/**
 * A map to store category background colors.
 */
const CATEGORY_BG_MAP: Record<string, string> = {
  "GARDEN": "bg-green-100",
  "YARD": "bg-green-100",
  "FOREST WORK": "bg-green-100",
  "CLEANING": "bg-blue-100",
  "HOUSEHOLD": "bg-blue-100",
  "MOVING": "bg-purple-100",
  "REPAIR": "bg-orange-100",
  "PAINTING": "bg-orange-100",
  "SNOW REMOVAL": "bg-cyan-100",
  "OTHER": "bg-gray-100",
};
const DEFAULT_BG = "bg-gray-100";

/**
 * Gets the corresponding Material Icon name for a category.
 */
const getCategoryIcon = (categoryTitle?: string): string => {
  const key = (categoryTitle || "").toUpperCase();
  return CATEGORY_ICON_MAP[key] || DEFAULT_ICON;
};

/**
 * Gets the corresponding Tailwind background class for a category.
 */
const getCategoryColor = (categoryTitle?: string): string => {
  const key = (categoryTitle || "").toUpperCase();
  return CATEGORY_BG_MAP[key] || DEFAULT_BG;
};

/**
 * Date formatter instance.
 */
const DATE_FORMATTER = new Intl.DateTimeFormat("fi-FI", {
  day: "numeric",
  month: "long",
});

/**
 * Formats an ISO date string.
 */
const formatDate = (isoString: string): string => {
  try {
    return DATE_FORMATTER.format(new Date(isoString));
  } catch (e) {
    return "Ei päivämäärää";
  }
};

/**
 * Creates a display string from a location object or string.
 */
const getLocationString = (location: LocationResponse | string | null | undefined): string => {
  if (!location) return "Ei sijaintia";
  if (typeof location === "string") return location;

  const parts: string[] = [];
  if (location.streetAddress) parts.push(location.streetAddress);
  if (location.city) parts.push(location.city);

  return parts.length > 0 ? parts.join(", ") : "Ei sijaintia";
};

/**
 * Generates user initials from a user name.
 */
const getUserInitials = (userName?: string | null): string => {
  if (!userName) return "?";
  const parts = userName.trim().split(/\s+/).filter(Boolean);
  
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }
  if (parts.length === 1 && parts[0].length > 0) {
    return parts[0].substring(0, 2).toUpperCase();
  }
  return "?";
};

// --- Component Props ---

interface TaskCardProps {
  task: Task;
}

// --- Optimized TaskCard Component ---

export default function TaskCard({ task }: TaskCardProps) {
  const navigate = useNavigate();

  /**
   * `useMemo` calculates derived values.
   * This logic only re-runs if the `task` prop changes.
   */
  const {
    categoryIcon,
    categoryBg,
    locationString,
    locationCount,
    userInitials,
    formattedDate,
    hasLocation,
  } = useMemo(() => {
    const catTitle = task.categories?.[0]?.title || "OTHER";
    const locs = task.locations || [];
    const firstLoc = locs[0];
    const locationStr = getLocationString(firstLoc);

    return {
      categoryIcon: getCategoryIcon(catTitle),
      categoryBg: getCategoryColor(catTitle), // Re-added color logic
      locationString: locationStr,
      locationCount: locs.length,
      userInitials: getUserInitials(task.user?.userName),
      formattedDate: task.startDate ? formatDate(task.startDate) : "Ei päivämäärää",
      hasLocation: locs.length > 0 && locationStr !== "Ei sijaintia",
    };
  }, [task]);

  /**
   * `useCallback` for stable function identity.
   */
  const handleClick = useCallback(() => {
    navigate({ to: "/worker/tasks/$taskId", params: { taskId: task.id.toString() } });
  }, [navigate, task.id]);

  /**
   * Accessibility handler for keyboard navigation.
   */
  const handleKeyDown = useCallback((event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      handleClick();
    }
  }, [handleClick]);

  // This JSX implements your requested layout:
  // [Image] | [Heading/Location/User] | [Description] | [Price/Time]
  return (
    <div
      className="bg-white rounded-lg border border-gray-200 hover:shadow-lg hover:border-green-400 transition-all duration-200 cursor-pointer overflow-hidden p-4 flex items-start gap-4"
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
      aria-label={`Näytä tehtävä: ${task.title}`}
    >
      {/* Column 1: Image (Color-coded Icon Block) */}
      <div 
        className={`w-24 h-24 md:w-28 md:h-28 flex-shrink-0 ${categoryBg} flex items-center justify-center rounded-lg`}
        aria-hidden="true"
      >
        <span className="material-icons text-gray-600 text-5xl">
          {categoryIcon}
        </span>
      </div>

      {/* Column 2: Heading, Location(s), User */}
      <div className="flex-1 min-w-0 flex flex-col gap-2">
        {/* Heading */}
        <h3 className="font-semibold text-gray-800 text-lg leading-tight">
          {task.title}
        </h3>

        {/* Location(s) */}
        {hasLocation && (
          <div className="flex items-center gap-2">
            <span className="material-icons text-green-500 text-base" aria-hidden="true">
              place
            </span>
            <div className="flex-1 min-w-0">
              <span className="text-sm text-gray-700">
                {locationString}
              </span>
              {locationCount > 1 && (
                <span className="ml-2 text-sm text-blue-600 font-medium">
                  +{locationCount - 1}
                </span>
              )}
            </div>
          </div>
        )}

        {/* User */}
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center text-white font-medium text-xs flex-shrink-0" aria-hidden="true">
            {userInitials}
          </div>
          <span className="text-sm text-gray-700 font-medium truncate">
            {task.user?.userName || "Nimetön käyttäjä"}
          </span>
        </div>
      </div>

      {/* Column 3: Description Block */}
      {/* 'flex-1' makes it flexible. 'hidden md:block' hides it on small screens. */}
      {task.description && (
        <div className="flex-1 min-w-0 hidden md:block">
          <p className="text-sm text-gray-600 line-clamp-3">
            {task.description}
          </p>
        </div>
      )}

      {/* Column 4: Price, Time */}
      <div className="flex flex-col items-end justify-start gap-2 flex-shrink-0 pl-2">
        {/* Price */}
        <span className="text-green-600 font-bold text-xl whitespace-nowrap">
          {task.price} €
        </span>

        {/* Date */}
        <div className="flex items-center gap-1.5 text-sm text-gray-600">
          <span className="material-icons text-green-500 text-base" aria-hidden="true">
            event
          </span>
          <span className="whitespace-nowrap">{formattedDate}</span>
        </div>
      </div>
    </div>
  );
}
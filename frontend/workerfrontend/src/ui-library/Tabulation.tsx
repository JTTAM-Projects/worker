import { useNavigate } from "@tanstack/react-router";

/**
 * Tabulation Component
 *
 * A reusable horizontal tab navigation component that renders clickable tabs with Material Icons.
 * Each tab navigates to a specified route when clicked, and the active tab is visually highlighted
 * with a green bottom border and text color.
 *
 * Features:
 * - Material Icons integration for visual indicators
 * - Active state highlighting with green accent
 * - Hover states for inactive tabs
 * - Smooth transitions between states
 * - Responsive spacing with Tailwind utilities
 *
 * @param {TabulationProps} props - Component props
 * @param {Tab[]} props.tabs - Array of tab configuration objects
 *
 * @typedef {Object} Tab
 * @property {string} iconName - Material Icon name (e.g., "task", "work", "history")
 * @property {string} label - Display text for the tab
 * @property {string} tabLink - Route path to navigate to when clicked
 * @property {boolean} isActive - Whether this tab is currently active (use matchRoute for automatic detection)
 *
 * @example
 * // Create a custom hook for shared tab configuration
 * // filepath: src/routes/_authenticated/worker/own-tasks/workerTaskTabConfig.tsx
 * import { useMatchRoute } from "@tanstack/react-router";
 *
 * export function useWorkerTaskTabs() {
 *   const matchRoute = useMatchRoute();
 *
 *   return [
 *     {
 *       iconName: "task",
 *       label: "Aktiiviset",
 *       tabLink: "/worker/own-tasks/to-do",
 *       isActive: !!matchRoute({ to: "/worker/own-tasks/to-do" }),
 *     },
 *     {
 *       iconName: "work",
 *       label: "Työn Alla",
 *       tabLink: "/worker/own-tasks/in-progress",
 *       isActive: !!matchRoute({ to: "/worker/own-tasks/in-progress" }),
 *     },
 *     {
 *       iconName: "hourglass_empty",
 *       label: "Odottaa hyväksyntää",
 *       tabLink: "/worker/own-tasks/waiting-approval",
 *       isActive: !!matchRoute({ to: "/worker/own-tasks/waiting-approval" }),
 *     },
 *     {
 *       iconName: "history",
 *       label: "Menneet",
 *       tabLink: "/worker/own-tasks/past",
 *       isActive: !!matchRoute({ to: "/worker/own-tasks/past" }),
 *     },
 *   ];
 * }
 *
 * // Use the hook in your page component
 * // filepath: src/routes/_authenticated/worker/own-tasks/to-do/index.tsx
 * import { useWorkerTaskTabs } from "../workerTaskTabConfig";
 * import Tabulation from "@/ui-library/Tabulation";
 *
 * function WorkerToDoTasksPage() {
 *   const tabs = useWorkerTaskTabs();
 *
 *   return (
 *     <main className="container mx-auto px-6 py-12">
 *       <Tabulation tabs={tabs} />
 *       {/* Rest of page content *\/}
 *     </main>
 *   );
 * }
 */

type Tab = {
  iconName: string;
  label: string;
  tabLink: string;
  isActive: boolean;
};

interface TabulationProps {
  tabs: Tab[];
}

export default function Tabulation({ tabs }: TabulationProps) {
  const navigate = useNavigate();

  return (
    <div className="flex gap-2">
      {tabs.map((tab, index) => (
        <button
          key={index}
          onClick={() => navigate({ to: tab.tabLink })}
          className={`whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium transition-colors ${
            tab.isActive
              ? "border-green-500 text-green-600"
              : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
          }`}
        >
          <span className="flex items-center gap-2">
            <span className="material-icons text-base">{tab.iconName}</span>
            {tab.label}
          </span>
        </button>
      ))}
    </div>
  );
}

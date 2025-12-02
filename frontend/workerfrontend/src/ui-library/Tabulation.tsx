import { useNavigate } from "@tanstack/react-router";

/**
 * Tabulation Component
 * 
 * Renders a horizontal tab navigation bar with Material Icons.
 * Each tab is a button that navigates to a specified route when clicked.
 * The active tab is highlighted with a green bottom border and text color.
 * 
 * @param {TabulationProps} props - Component props
 * @param {Tab[]} props.tabs - Array of tab objects defining the navigation items
 * 
 * @example
 * const tabs = [
 *   { iconName: "task", label: "Aktiiviset", tabLink: "/worker/own-tasks/to-do", isActive: true },
 *   { iconName: "work", label: "Työn alla", tabLink: "/worker/own-tasks/in-progress", isActive: false },
 *   { iconName: "hourglass_empty", label: "Odottaa hyväksyntää", tabLink: "/worker/own-tasks/waiting-approval", isActive: false },
 *   { iconName: "history", label: "Menneet", tabLink: "/worker/own-tasks/past", isActive: false },
 * ];
 * 
 * <Tabulation tabs={tabs} />
 */

type Tab = {
  iconName: string,
  label: string,
  tabLink: string,
  isActive: boolean,
}

interface TabulationProps {
  tabs: Tab[];
}

export default function Tabulation( { tabs } : TabulationProps) {
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
  )
}
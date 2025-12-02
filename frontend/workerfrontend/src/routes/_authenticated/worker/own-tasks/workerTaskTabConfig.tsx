import { useMatchRoute } from "@tanstack/react-router";

export function useWorkerTaskTabs() {
  const matchRoute = useMatchRoute();

  return [
    {
      iconName: "task",
      label: "Aktiiviset",
      tabLink: "/worker/own-tasks/to-do",
      isActive: !!matchRoute({ to: "/worker/own-tasks/to-do" }) ,
    },
    {
      iconName: "work",
      label: "Työn Alla",
      tabLink: "/worker/own-tasks/in-progress",
      isActive: !!matchRoute({ to: "/worker/own-tasks/in-progress" }),
    },
    {
      iconName: "hourglass_empty",
      label: "Odottaa hyväksyntää",
      tabLink: "/worker/own-tasks/waiting-approval",
      isActive: !!matchRoute({ to: "/worker/own-tasks/waiting-approval" }),
    },
    {
      iconName: "history",
      label: "Menneet",
      tabLink: "/worker/own-tasks/past",
      isActive: !!matchRoute({ to: "/worker/own-tasks/past" }),
    },
  ];
}
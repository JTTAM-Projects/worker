import { useMatchRoute } from "@tanstack/react-router";

export function useWorkerApplicationTabs() {
  const matchRoute = useMatchRoute();

  return [
    {
      iconName: "task",
      label: "Aktiiviset Hakemukset",
      tabLink: "/worker/my-applications/active",
      isActive: !!matchRoute({ to: "/worker/my-applications/active" }) ,
    },
    {
      iconName: "history",
      label: "Menneet Hakemukset",
      tabLink: "/worker/my-applications/past",
      isActive: !!matchRoute({ to: "/worker/my-applications/past" }),
    },    
    {
      iconName: "work",
      label: "Työ Tarjoukset",
      tabLink: "/worker/my-applications/job-offers",
      isActive: !!matchRoute({ to: "/worker/my-applications/job-offers" }),
    },
  ];
}

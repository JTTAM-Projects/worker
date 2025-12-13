export function formatDate(isoString: string) {
  const date = new Date(isoString);
  return date.toLocaleDateString("fi-FI", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function formatTime(isoString: string) {
  const time = new Date(isoString);
  return time.toLocaleTimeString("fi-FI", {
    hour: "numeric",
    minute: "numeric",
  });
}

export const getCategoryIcon = (title: string) => {
  switch ((title || "").toUpperCase()) {
    case "GARDEN":
      return "yard";
    case "CLEANING":
      return "cleaning_services";
    case "MOVING":
      return "local_shipping";
    case "HOUSEHOLD":
      return "home";
    case "REPAIR":
      return "build";
    case "PAINTING":
      return "format_paint";
    case "SNOW REMOVAL":
      return "ac_unit";
    case "FOREST WORK":
      return "park";
    case "YARD":
      return "grass";
    case "OTHER":
      return "handyman";
    default:
      return "work";
  }
};

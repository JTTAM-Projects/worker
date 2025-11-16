export function getCategoryIcon(categoryTitle: string) {
  switch (categoryTitle?.toUpperCase()) {
    case "GARDEN":
      return "yard";
    case "CLEANING":
      return "cleaning_services";
    case "MOVING":
      return "local_shipping";
    case "OTHER":
      return "handyman";
    case "YARD":
      return "grass";
    case "FOREST WORK":
      return "forest";
    case "HOUSEHOLD":
      return "home";
    case "REPAIR":
      return "build";
    case "PAINTING":
      return "format_paint";
    case "SNOW REMOVAL":
      return "ac_unit";
    default:
      return "work";
  }
}

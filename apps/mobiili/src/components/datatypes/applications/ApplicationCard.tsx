import { View, Text, TouchableOpacity } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

export type Application = {
  id: number;
  applicationStatus: string;
  priceSuggestion: number;
  timeSuggestion: string;
  task: {
    title: string;
    categories: Category[];
    locations: location[];
  };
};

type Category = {
  title: string;
};

type location = {
  streetAddress: string;
  city: string;
  postalCode: string;
};

const formatDate = (isoString: string) =>
  new Date(isoString).toLocaleDateString("fi-FI", { day: "numeric", month: "long" });
const formatTime = (isoString: string) =>
  new Date(isoString).toLocaleTimeString("fi-FI", { hour: "2-digit", minute: "2-digit" });

const getCategoryIcon = (title: string) => {
  switch (title?.toUpperCase()) {
    case "CLEANING":
      return "cleaning-services";
    case "YARD":
      return "grass";
    default:
      return "work";
  }
};

const getCategoryBg = (categoryTitle: string) => {
  switch (categoryTitle?.toUpperCase()) {
    case "CLEANING":
      return "bg-blue-100";
    case "YARD":
      return "bg-green-100";
    default:
      return "bg-gray-100";
  }
};

export default function ApplicationCard({ application }: { application: Application }) {
  const categories = application.task?.categories ?? [];
  const primaryCategory = categories[0]?.title ?? "OTHER";
  const categoryIcon = getCategoryIcon(primaryCategory);
  const categoryBg = getCategoryBg(primaryCategory);

  const location = application.task?.locations?.[0];
  const locationLabel = location ? location.city?.toUpperCase() : "Ei sijaintitietoja";

  return (
    <TouchableOpacity className="bg-white rounded-xl border border-gray-200 shadow flex-row overflow-hidden my-2">
      {/* Vasen: Ikoni ja status */}
      <View className={`w-28 h-28 items-center justify-center ${categoryBg} relative`}>
        <MaterialIcons name={categoryIcon} size={48} color="#4B5563" />
      </View>
      {/* Oikea: Sisältö */}
      <View className="flex-1 p-4 justify-between">
        <View className="flex-row items-center justify-between">
          <Text className="text-lg font-bold text-gray-800">{application.task?.title}</Text>
          <Text className="text-green-600 font-bold text-lg">{application.priceSuggestion} €</Text>
        </View>
        <View className="flex-row items-center mt-1 justify-between">
          <View className="flex-row">
            <MaterialIcons name="location-on" size={18} color="#22C55E" />
            <Text className="ml-1 text-gray-600">{locationLabel}</Text>
          </View>
          <View className="flex-row">
            <MaterialIcons name="event" size={18} color="#22C55E" />
            <Text className="ml-1 text-gray-600">{formatDate(application.timeSuggestion)}</Text>
          </View>
        </View>
        <View className="flex-row items-center mt-1">
          <MaterialIcons name="schedule" size={18} color="#22C55E" />
          <Text className="ml-1 text-gray-600">{formatTime(application.timeSuggestion)}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

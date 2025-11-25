import { View, Text, TouchableOpacity } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { Task } from "@myorg/shared";

export default function TaskCard({ task }: { task: Task }) {
  const formatDate = (isoString: string) =>
    new Date(isoString).toLocaleDateString("fi-FI", { day: "numeric", month: "long" });

  const getCategoryIcon = (categoryTitle: string) => {
    switch (categoryTitle?.toUpperCase()) {
      case "YARD":
        return "grass";
      case "GARDEN":
        return "yard";
      case "CLEANING":
        return "cleaning-services";
      default:
        return "work";
    }
  };

  const getCategoryColor = (categoryTitle: string) => {
    switch (categoryTitle?.toUpperCase()) {
      case "YARD":
        return "bg-green-100";
      case "CLEANING":
        return "bg-blue-100";
      default:
        return "bg-gray-100";
    }
  };

  const getUserInitials = (userName: string) => {
    if (!userName) return "?";
    const parts = userName.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return userName.substring(0, 2).toUpperCase();
  };

  const firstCategory = task.categories?.[0]?.title || "OTHER";
  const categoryIcon = getCategoryIcon(firstCategory);
  const categoryBg = getCategoryColor(firstCategory);

  return (
    <TouchableOpacity className="bg-white rounded-xl border border-gray-200 shadow-md flex-row overflow-hidden my-2">
      {/* Vasen: Ikoni */}
      <View className={`w-28 h-32 items-center justify-center ${categoryBg}`}>
        <MaterialIcons name={categoryIcon} size={48} color="#4B5563" />
      </View>
      {/* Oikea: Sisältö */}
      <View className="flex-1 p-3 justify-between">
        {/* Otsikko & hinta */}
        <View className="flex-row justify-between items-start mb-2">
          <Text className="font-bold text-gray-800 text-lg flex-1">{task.title}</Text>
          <Text className="text-green-600 font-bold text-xl">{task.price} €</Text>
        </View>
        {/* Sijainti & päivä */}
        <View className="flex-row items-center gap-x-4 mb-2">
          <View className="flex-row items-center">
            <MaterialIcons name="place" size={18} color="#22C55E" />
            <Text className="ml-1 text-gray-600">{task.locations[0].city}</Text>
          </View>
          <View className="flex-row items-center">
            <MaterialIcons name="event" size={18} color="#22C55E" />
            <Text className="ml-1 text-gray-600">{formatDate(task.startDate)}</Text>
          </View>
        </View>
        {/* Käyttäjä */}
        <View className="flex-row items-center gap-x-2 pt-2 border-t border-gray-100">
          <View className="w-7 h-7 rounded-full bg-green-500 items-center justify-center">
            <Text className="text-white font-medium text-sm">{getUserInitials(task.user.userName)}</Text>
          </View>
          <Text className="text-sm text-gray-700 font-medium">{task.user.userName}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

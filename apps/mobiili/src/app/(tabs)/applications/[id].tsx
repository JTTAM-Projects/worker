import ProfileDetail from "@/src/components/datatypes/profile/ProfileDetail";
import { Ionicons } from "@expo/vector-icons";
import { Stack, useLocalSearchParams } from "expo-router";
import { View } from "react-native";

export default function Application() {
  const params = useLocalSearchParams<{ id: string }>();

  return (
    <View className="flex-1 items-center p-4 bg-white rounded-2xl shadow-md">
      <Stack.Screen
        options={{
          title: params.id,
          headerTitleAlign: "left",
          headerTitleStyle: {
            fontWeight: "black",
          },
        }}
      />
      <ProfileDetail image={<Ionicons name="person" size={24} color="black" />} title="id" detail={params.id} />
    </View>
  );
}

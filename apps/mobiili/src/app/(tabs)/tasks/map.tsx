import DummyMap from "@/src/components/common/DummyMap";
import { Stack } from "expo-router";
import { View } from "react-native";

export default function Map() {
  return (
    <View className="flex-1 items-center justify-center pr-3 pl-3">
      <Stack.Screen
        options={{
          title: "Kartta",
          headerTitleAlign: "left",
          headerTitleStyle: {
            fontWeight: "black",
          },
        }}
      />
      <DummyMap />
    </View>
  );
}

import { Stack } from "expo-router";

export default function TasksLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: "Työilmoitukset",
          headerTitleAlign: "center",
          headerTitleStyle: {
            fontWeight: "black",
          },
        }}
      />
      <Stack.Screen
        name="map"
        options={{
          animation: "slide_from_bottom",
          headerTitleAlign: "left",
          headerTitleStyle: {
            fontWeight: "black",
          },
        }}
      />
      <Stack.Screen
        name="[id]"
        options={{
          headerTitleAlign: "left",
          headerTitleStyle: {
            fontWeight: "black",
          },
        }}
      />
    </Stack>
  );
}

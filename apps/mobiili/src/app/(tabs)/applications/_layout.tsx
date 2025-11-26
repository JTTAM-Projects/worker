import { Stack } from "expo-router";

export default function ApplicationsLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: "Hakemukset",
          headerTitleAlign: "center",
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

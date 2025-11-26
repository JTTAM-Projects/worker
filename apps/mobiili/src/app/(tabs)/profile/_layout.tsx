import SmallNavigate from "@/src/components/ui/SmallNavigate";
import { SimpleLineIcons } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";

export default function ProfileLayout() {
  const route = useRouter();

  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          headerRight: () => (
            <SmallNavigate
              vectorImage={<SimpleLineIcons name="pencil" size={24} color="black" />}
              title=""
              to={() => route.push("/profile/edit")}
            />
          ),
          title: "Omat tiedot",
          headerTitleAlign: "center",
          headerTitleStyle: {
            fontWeight: "black",
          },
        }}
      />
      <Stack.Screen
        name="edit"
        options={{
          title: "Muokkaa",
          animation: "slide_from_right",
          headerTitleAlign: "left",
          headerTitleStyle: {
            fontWeight: "black",
          },
        }}
      />
    </Stack>
  );
}

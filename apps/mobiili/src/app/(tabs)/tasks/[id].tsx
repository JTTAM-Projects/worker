import Detail from "@/src/components/datatypes/profile/Detail";
import WideButton from "@/src/components/ui/WideButton";
import { FontAwesome5, FontAwesome6, Fontisto, Octicons } from "@expo/vector-icons";
import { formatDate, useTaskById } from "@myorg/shared";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { View } from "react-native";

export default function Task() {
  const params = useLocalSearchParams<{ id: string }>();
  const { data } = useTaskById(parseInt(params.id));
  const router = useRouter();

  return (
    <View className="flex-1 items-center p-4 bg-white rounded-2xl shadow-md">
      <Stack.Screen
        options={{
          title: data?.title,
          headerTitleAlign: "left",
          headerTitleStyle: {
            fontWeight: "black",
          },
        }}
      />
      <Detail image={<FontAwesome5 name="euro-sign" size={24} color="green" />} title="Hinta" detail={data?.price} />
      <Detail
        image={<Fontisto name="date" size={24} color="black" />}
        title="Alkamisajankohta"
        detail={data?.startDate ? formatDate(data.startDate) : ""}
      />
      <Detail
        image={<Fontisto name="date" size={24} color="black" />}
        title="Päättymisajankohta"
        detail={data?.endDate ? formatDate(data!.endDate) : ""}
      />
      <Detail
        image={<FontAwesome6 name="location-dot" size={24} color="black" />}
        title="Sijainti"
        detail={`${data?.locations[0].streetAddress}, ${data?.locations[0].city}, ${data?.locations[0].country}`}
      />
      <Detail image={<Octicons name="goal" size={24} color="black" />} title="Kuvaus" detail={data?.description} />

      <WideButton title="Lähetä hakemus" onPress={() => router.push("/(tabs)/applications")} />
    </View>
  );
}

import DefaultBigNavigate from "@/src/components/ui/DefaultBigNavigate";
import { useRouter } from "expo-router";
import { Text, View } from "react-native";

export default function Index() {
  const router = useRouter();
  return (
    <View className="flex-1 items-center justify-center p-4">
      <Text>Edit app/tabs/index.tsx to edit this screen.</Text>
      <DefaultBigNavigate title="Työilmoituksiin" to={() => router.push("/(tabs)/tasks")} />
      <DefaultBigNavigate title="Hakemuksiin" to={() => router.push("/(tabs)/applications")} />
    </View>
  );
}

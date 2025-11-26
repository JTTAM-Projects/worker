import BigNavigate from "@/src/components/ui/BigNavigate";
import useLogin from "@/src/components/ui/useLogin";
import { useRouter } from "expo-router";
import { View, Text } from "react-native";
import { useAuth0 } from "react-native-auth0";

export default function Index() {
  const { handleLogin } = useLogin();
  const { user } = useAuth0();
  const router = useRouter();
  return (
    <View className="flex-1 items-center justify-center p-4">
      <Text className="font-bold">Muutama puute:</Text>
      <Text>Sivuja jotka vaativat jwt, pyyntöjen tekemiseen, ei ole suojattu</Text>
      <Text>Kartta -toiminto työilmoitukset -sivulla ei toimi</Text>
      <Text>Oman profiilin tietojen muokkauksessa ei voi muokata tietoja</Text>
      <Text>Hakemuksen lähettäminen ei tee mitää vaikka on nappi</Text>
      {!user && <BigNavigate to={handleLogin} title="Kirjaudu sisään" />}
      <BigNavigate title="Työilmoituksiin" to={() => router.push("/(tabs)/tasks")} />
      {user && <BigNavigate title="Hakemuksiin" to={() => router.push("/(tabs)/applications")} />}
    </View>
  );
}

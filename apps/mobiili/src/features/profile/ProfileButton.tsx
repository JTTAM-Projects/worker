import { Button } from "@react-navigation/elements";
import { useRouter } from "expo-router";

export function ProfileButton() {
  const router = useRouter();
  return <Button onPress={() => router.push("/profile/index")}>Profiili</Button>;
}

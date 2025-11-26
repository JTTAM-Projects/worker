import { useAuth0 } from "react-native-auth0";
import "../../../global.css";
import { useRouter } from "expo-router";

export default function useLogin() {
  const router = useRouter();
  const { authorize, clearSession } = useAuth0();

  const handleLogin = async () => {
    try {
      await authorize({ audience: "https://glig.com", scope: "openid profile email" });
    } catch (e) {
      console.error(e);
    }
  };

  const handleLogout = async () => {
    try {
      await clearSession();
      router.push("/");
    } catch (e) {
      console.error(e);
    }
  };

  return { handleLogin, handleLogout };
}

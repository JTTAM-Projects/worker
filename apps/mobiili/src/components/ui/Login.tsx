import { View, Text, Pressable } from "react-native";
import { useAuth0 } from "react-native-auth0";
import "../../../global.css";
import Entypo from "@expo/vector-icons/build/Entypo";

export default function Login() {
  const { authorize, clearSession, user, error, isLoading } = useAuth0();

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
    } catch (e) {
      console.error(e);
    }
  };

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text>Ladataan...</Text>
      </View>
    );
  }

  return (
    <View className="justify-center p-4">
      {user ? (
        <>
          <Pressable className="bg-white px-8 py-1 rounded" onPress={handleLogout}>
            <Entypo name="login" size={24} color="red" />
          </Pressable>
        </>
      ) : (
        <>
          <Pressable className="bg-green-500 px-2 py-1 rounded" onPress={handleLogin}>
            <Entypo name="login" size={24} color="white" />
          </Pressable>
        </>
      )}
      {error && <Text className="text-red-500 mt-4">{error.message}</Text>}
    </View>
  );
}

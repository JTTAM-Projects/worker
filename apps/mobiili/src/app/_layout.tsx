import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Auth0Provider } from "react-native-auth0";

export default function RootLayout() {
  return (
    <Auth0Provider domain="jk-projects.eu.auth0.com" clientId="x60B8rXt645ak4BLuE4LqVcIoovQBzrq">
      <SafeAreaProvider>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        </Stack>
      </SafeAreaProvider>
    </Auth0Provider>
  );
}

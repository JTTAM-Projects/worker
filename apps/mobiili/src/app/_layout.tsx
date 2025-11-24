import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Auth0Provider } from "react-native-auth0";

export default function RootLayout() {
  const domain = process.env.EXPO_PUBLIC_AUTH0_DOMAIN;
  const client = process.env.EXPO_PUBLIC_CLIENT_ID;
  return (
    <Auth0Provider domain={domain!} clientId={client!}>
      <SafeAreaProvider>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        </Stack>
      </SafeAreaProvider>
    </Auth0Provider>
  );
}

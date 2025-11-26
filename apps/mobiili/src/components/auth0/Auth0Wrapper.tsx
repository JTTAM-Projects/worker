import { useAuth0 } from "react-native-auth0";
import { View, ActivityIndicator } from "react-native";

export function Auth0Wrapper({ children }) {
  const { user, isLoading, authorize } = useAuth0();

  if (isLoading) {
    return <ActivityIndicator />;
  }

  if (!user) {
    authorize();
    return <View />;
  }

  return children;
}

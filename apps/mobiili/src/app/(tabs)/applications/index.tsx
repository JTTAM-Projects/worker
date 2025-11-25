import ApplicationTable from "@/src/components/datatypes/applications/ApplicationTable";
import { useUserApplications } from "@myorg/shared";
import { Text, View } from "react-native";

export default function Applications() {
  const paginatedResponse = useUserApplications();
  const applications = paginatedResponse.data?.content ?? [];

  return (
    <View className="flex-1 items-center justify-center p-4">
      <Text>Edit app/tabs/applications/index.tsx to edit this screen.</Text>
      <ApplicationTable items={applications} />
    </View>
  );
}

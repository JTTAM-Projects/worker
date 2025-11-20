import { Application } from "@/src/components/datatypes/applications/ApplicationCard";
import ApplicationTable from "@/src/components/datatypes/applications/ApplicationTable";
import { Text, View, Button } from "react-native";
import { useAuth0 } from "react-native-auth0";

export default function Applications() {
  const { getCredentials, user } = useAuth0();

  const handleShowToken = async () => {
    const credentials = await getCredentials();
    alert("Access Token:\n" + credentials.accessToken);
  };

  const exampleApplications: Application[] = [
    {
      id: 0,
      applicationStatus: "PENDING",
      priceSuggestion: 50,
      timeSuggestion: "2025-11-21T12:00:00.000Z",
      task: {
        title: "Ikkunoiden pesu",
        categories: [{ title: "CLEANING" }],
        locations: [{ streetAddress: "Katu 1", city: "Espoo", postalCode: "02100" }],
      },
    },
    {
      id: 1,
      applicationStatus: "ACCEPTED",
      priceSuggestion: 150,
      timeSuggestion: "2025-06-17T08:30:00.000Z",
      task: {
        title: "Raivaus",
        categories: [{ title: "YARD" }],
        locations: [{ streetAddress: "Skutsipoiku 15", city: "Kangasniemi", postalCode: "51200" }],
      },
    },
  ];

  return (
    <View className="flex-1 items-center justify-center p-4">
      <Text>Edit app/tabs/applications/index.tsx to edit this screen.</Text>
      <Button title="Näytä JWT access token" onPress={handleShowToken} />
      {user && <Text>Käyttäjä: {user.name}</Text>}
      <ApplicationTable items={exampleApplications} />
    </View>
  );
}

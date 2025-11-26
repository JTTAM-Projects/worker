import { View, Text } from "react-native";
import { type TaskerProfile } from "@myorg/shared";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import ProfileDetail from "./ProfileDetail";

export default function ProfileDetailCard({ profile }: { profile: TaskerProfile }) {
  if (!profile) {
    return (
      <View className="items-center p-4 bg-white rounded-2xl shadow-md">
        <Text className="text-gray-400">Ei profiilitietoja</Text>
      </View>
    );
  }

  const vectorSize = 20;

  return (
    <View className="w-full items-center p-4 bg-white rounded-2xl shadow-md">
      <ProfileDetail
        image={<Ionicons name="person" size={vectorSize} color="black" />}
        title="Etunimi"
        detail={profile.firstName}
      />
      <ProfileDetail
        image={<Ionicons name="person" size={vectorSize} color="black" />}
        title="Sukunimi"
        detail={profile.lastName}
      />
      <ProfileDetail
        image={<MaterialIcons name="location-on" size={vectorSize} color="black" />}
        title="Maa"
        detail={profile.country}
      />
      <ProfileDetail
        image={<MaterialIcons name="location-on" size={vectorSize} color="black" />}
        title="Kaupunki"
        detail={profile.city}
      />
      <ProfileDetail
        image={<MaterialIcons name="location-on" size={vectorSize} color="black" />}
        title="Katuosoite"
        detail={profile.streetAddress}
      />
    </View>
  );
}

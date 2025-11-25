import { View, Text } from "react-native";
import { type TaskerProfile } from "@myorg/shared";

export default function ProfileDetailCard({ profile }: { profile: TaskerProfile }) {
  if (!profile) {
    return (
      <View className="items-center p-4">
        <Text className="text-gray-400">Ei profiilitietoja</Text>
      </View>
    );
  }
  return (
    <View className="items-center p-4">
      <Text className="text-xl font-bold mb-1">
        {profile.firstName ? profile.firstName : <Text className="text-gray-400">Ei etunimeä</Text>}{" "}
        {profile.lastName ? profile.lastName : <Text className="text-gray-400">Ei sukunimeä</Text>}
      </Text>
      <Text className={profile.bio ? "text-gray-600 mb-2" : "text-gray-400 mb-2"}>
        {profile.bio ? profile.bio : "Ei esittelyä"}
      </Text>
      <Text className={profile.streetAddress && profile.postalCode && profile.city ? "mb-1" : "text-gray-400 mb-1"}>
        {profile.streetAddress && profile.postalCode && profile.city
          ? `${profile.streetAddress}, ${profile.postalCode} ${profile.city}`
          : "Ei osoitetta"}
      </Text>
      <Text className={profile.country ? "mb-1" : "text-gray-400 mb-1"}>
        {profile.country ? profile.country : "Ei maata"}
      </Text>
      {profile.websiteLink ? (
        <Text className="text-blue-600 underline mb-2">{profile.websiteLink}</Text>
      ) : (
        <Text className="text-gray-400 mb-2">Ei verkkosivua</Text>
      )}
    </View>
  );
}

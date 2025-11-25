import ProfileDetailCard from "@/src/components/datatypes/profile/ProfileDetailCard";
import { TaskerProfile, useCreateProfile, useProfile } from "@myorg/shared";
import { useEffect } from "react";
import { Text, View } from "react-native";

const defaultTaskerProfile: TaskerProfile = {
  firstName: "mr",
  lastName: "robot",
  bio: "beep",
  streetAddress: "boop",
  postalCode: "",
  city: "",
  country: "",
  websiteLink: "",
  profileImageUrl: "",
};

export default function Profile() {
  const { data: profile } = useProfile();
  const { create } = useCreateProfile();

  useEffect(() => {
    async function checkProfile(profile: TaskerProfile) {
      if (!profile) {
        await create(defaultTaskerProfile);
      }
      return;
    }

    if (profile !== null) {
      checkProfile(profile);
    }
  }, [profile, create]);

  return (
    <View className="flex-1 items-center justify-center p-4">
      <Text>Edit app/tabs/profile/index.tsx to edit this screen.</Text>
      <ProfileDetailCard profile={profile} />
    </View>
  );
}

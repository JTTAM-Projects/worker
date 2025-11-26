import ProfileDetailCard from "@/src/components/datatypes/profile/ProfileDetailCard";
import { TaskerProfile, useCreateProfile, useProfile } from "@myorg/shared";
import { useEffect } from "react";
import { View } from "react-native";

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
  const { data: profile, refetch, loading } = useProfile();
  const { create } = useCreateProfile();

  useEffect(() => {
    if (!loading && profile === null) {
      create(defaultTaskerProfile).then(() => refetch());
    }
  }, []);

  return (
    <View className="flex-1 items-center justify-start p-4">
      <ProfileDetailCard profile={profile} />
    </View>
  );
}

import { ReactNode } from "react";
import { View, Text } from "react-native";

export type ProfileDetailProps = {
  image: ReactNode;
  title: string;
  detail: any;
};

export default function Detail(props: ProfileDetailProps) {
  return (
    <View className="items-start w-full mb-4 flex-row border-b border-gray-300">
      <View className="bg-white w-10 h-10 items-center justify-center mr-4 mb-6 mt-6">{props.image}</View>
      <View className="mb-6 mt-6 w-full">
        <View>
          <Text className="color-slate-500">{props.title}</Text>
          <Text className="color-black">{props.detail}</Text>
        </View>
      </View>
    </View>
  );
}

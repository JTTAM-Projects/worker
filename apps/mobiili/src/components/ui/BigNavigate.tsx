import { ReactNode } from "react";
import { Pressable, View, Text } from "react-native";

export type NavigateButtonProps = {
  title: string;
  to: () => void;
  vectorImage?: ReactNode;
};
export default function BigNavigate(props: NavigateButtonProps) {
  return (
    <Pressable onPress={props.to} className="w-full h-16 bg-gray-50 justify-center items-center my-2 shadow-md">
      <View>
        <Text>{props.title}</Text>
      </View>
    </Pressable>
  );
}

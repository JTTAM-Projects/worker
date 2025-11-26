import { Pressable, View } from "react-native";
import { NavigateButtonProps } from "./BigNavigate";

export default function SmallNavigate(props: NavigateButtonProps) {
  return (
    <View>
      <Pressable onPress={props.to}>{props.vectorImage}</Pressable>
    </View>
  );
}

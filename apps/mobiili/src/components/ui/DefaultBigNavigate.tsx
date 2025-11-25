import { Pressable, View, Text } from "react-native";

export type NavigateButtonProps = {
  title: string;
  to: () => void;
};
export default function DefaultBigNavigate(props: NavigateButtonProps) {
  return (
    <View>
      <Pressable onPress={props.to}>
        <Text>{props.title}</Text>
      </Pressable>
    </View>
  );
}

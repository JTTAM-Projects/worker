import { Pressable, Text } from "react-native";

interface WideButtonProps {
  title: string;
  onPress: () => void;
}

export default function WideButton({ title, onPress }: WideButtonProps) {
  return (
    <Pressable className="w-full bg-green-500 py-4 rounded-xl items-center justify-center my-2" onPress={onPress}>
      <Text className="text-white text-lg font-bold">{title}</Text>
    </Pressable>
  );
}

import TaskCard from "@/src/components/datatypes/tasks/TaskCard";
import { Text, View } from "react-native";

export default function tasks() {
  return (
    <View className="flex-1 items-center justify-center p-4">
      <Text>Edit app/tabs/tasks/index.tsx to edit this screen.</Text>
      <TaskCard />
    </View>
  );
}

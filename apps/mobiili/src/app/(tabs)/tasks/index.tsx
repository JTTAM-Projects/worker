import TaskTable from "@/src/components/datatypes/tasks/TaskTable";
import { useTasks } from "@myorg/shared";
import { Text, View } from "react-native";

export default function Tasks() {
  const { data } = useTasks();
  return (
    <View className="flex-1 items-center justify-center p-4">
      <Text>Edit app/tabs/tasks/index.tsx to edit this screen.</Text>
      <TaskTable items={data?.content!} />
    </View>
  );
}

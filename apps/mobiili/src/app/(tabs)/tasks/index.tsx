import TaskTable from "@/src/components/datatypes/tasks/TaskTable";
import { useTasks } from "@myorg/shared";
import { useRouter } from "expo-router";
import { Pressable, Text, View } from "react-native";

export default function Tasks() {
  const { data } = useTasks();
  const route = useRouter();
  return (
    <View className="flex-1 items-center justify-center pr-3 pl-3">
      <View className="flex-row gap-6 items-center justify-center p-4 ">
        <Pressable className="bg-white rounded-full px-4 py-2" onPress={() => route.push("/tasks/map")}>
          <Text className="">Näytä kartalla</Text>
        </Pressable>
      </View>
      <TaskTable items={data?.content!} />
    </View>
  );
}

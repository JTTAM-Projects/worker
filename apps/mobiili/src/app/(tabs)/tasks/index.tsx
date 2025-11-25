import TaskTable from "@/src/components/datatypes/tasks/TaskTable";
import { useTasks } from "@myorg/shared";
import { useState } from "react";
import { Pressable, Text, View } from "react-native";

export default function Tasks() {
  const { data } = useTasks();
  const [showMap, setShowMap] = useState(false);
  return (
    <View className="flex-1 items-center justify-center p-4">
      <View className="flex-row gap-6 items-center justify-center p-4 ">
        <Pressable className="bg-white rounded-full px-4 py-2" onPress={() => setShowMap(false)}>
          <Text>Taulukko</Text>
        </Pressable>
        <Pressable className="bg-white rounded-full px-4 py-2" onPress={() => setShowMap(true)}>
          <Text className="">Kartta</Text>
        </Pressable>
      </View>
      {!showMap ? <TaskTable items={data?.content!} /> : <></>}
    </View>
  );
}

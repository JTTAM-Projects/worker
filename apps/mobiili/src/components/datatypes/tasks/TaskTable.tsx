import { FlatList } from "react-native";
import TaskCard from "./TaskCard";
import { Task } from "@myorg/shared";

export default function TaskTable({ items }: { items: Task[] }) {
  return (
    <FlatList
      style={{ flex: 1, width: "100%" }}
      data={items}
      renderItem={({ item }) => <TaskCard task={item} />}
      keyExtractor={(item) => item.id.toString()}
    />
  );
}

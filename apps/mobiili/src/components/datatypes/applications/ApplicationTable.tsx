import { FlatList } from "react-native";
import ApplicationCard, { Application } from "./ApplicationCard";

export default function ApplicationTable({ items }: { items: Application[] }) {
  return (
    <FlatList
      style={{ flex: 1, width: "100%" }}
      data={items}
      renderItem={({ item }) => <ApplicationCard application={item} />}
      keyExtractor={(item) => item.id.toString()}
    />
  );
}

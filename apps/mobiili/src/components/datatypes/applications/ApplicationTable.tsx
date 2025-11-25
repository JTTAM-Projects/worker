import { FlatList } from "react-native";
import ApplicationCard from "./ApplicationCard";
import { ApplicationWithDetails } from "@myorg/shared/features/application/types";

export default function ApplicationTable({ items }: { items: ApplicationWithDetails[] }) {
  return (
    <FlatList
      style={{ flex: 1, width: "100%" }}
      data={items}
      renderItem={({ item }) => <ApplicationCard application={item} />}
    />
  );
}

import { Tabs } from "expo-router";
import "../../../global.css";
import React from "react";
import { StatusBar } from "expo-status-bar";
import { Entypo, FontAwesome, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import Login from "@/src/components/ui/Login";

export default function RootLayout() {
  return (
    <React.Fragment>
      <StatusBar style="auto" />
      <Tabs
        screenOptions={{
          headerRight: () => <Login />,
          tabBarActiveTintColor: "#22c55e",
          headerTitleAlign: "center",
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Etusivu",
            tabBarIcon: ({ color, size }) => <Entypo name="home" size={size} color={color} />,
          }}
        />
        <Tabs.Screen
          name="tasks"
          options={{
            title: "Työilmoitukset",
            tabBarIcon: ({ color, size }) => <FontAwesome name="tasks" size={size} color={color} />,
          }}
        />
        <Tabs.Screen
          name="applications"
          options={{
            title: "Hakemukset",
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="application-edit-outline" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: "Profiili",
            tabBarIcon: ({ color, size }) => <Ionicons name="person" size={size} color={color} />,
          }}
        />
      </Tabs>
    </React.Fragment>
  );
}

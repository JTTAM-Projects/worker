import { Tabs } from "expo-router";
import "../../../global.css";
import React from "react";
import { StatusBar } from "expo-status-bar";
import { Entypo, FontAwesome, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

export default function RootLayout() {
  return (
    <React.Fragment>
      <StatusBar style="auto" />
      <Tabs
        screenOptions={{
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
            headerShown: false,
            tabBarIcon: ({ color, size }) => <FontAwesome name="tasks" size={size} color={color} />,
          }}
        />
        <Tabs.Screen
          name="applications"
          options={{
            title: "Hakemukset",
            headerShown: false,
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="application-edit-outline" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: "Profiili",
            headerShown: false,
            tabBarIcon: ({ color, size }) => <Ionicons name="person" size={size} color={color} />,
          }}
        />
      </Tabs>
    </React.Fragment>
  );
}

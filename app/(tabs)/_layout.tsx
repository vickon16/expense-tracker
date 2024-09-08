import { colors } from "@/constants/colors";
import { cn } from "@/lib/utils";
import { FontAwesome, SimpleLineIcons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React from "react";
import { View } from "react-native";

const TabsLayout = () => {
  return (
    <>
      <Tabs
        screenOptions={{
          tabBarStyle: {
            backgroundColor: colors.grayC,
            position: "absolute",
            bottom: 20,
            justifyContent: "center",
            alignSelf: "center",
            height: 63,
            left: "50%",
            width: 150,
            transform: [{ translateX: -90 }],
            paddingHorizontal: 10,
            paddingBottom: 8,
            paddingTop: 8,
            borderRadius: 40,
            borderColor: "transparent",
            elevation: 1.5,
          },
          tabBarShowLabel: false,
          tabBarInactiveTintColor: colors.grayTintC,
          tabBarActiveTintColor: colors.whiteC,
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            tabBarIcon: ({ color, size, focused }) => (
              <View
                className={cn("p-3 rounded-2xl bg-grayC", {
                  "bg-secondaryC": focused,
                })}
              >
                <SimpleLineIcons name="pie-chart" size={20} color={color} />
              </View>
            ),
          }}
        />
        <Tabs.Screen
          name="create"
          options={{
            headerShown: false,
            tabBarIcon: ({ color, size, focused }) => (
              <View
                className={cn("p-3 rounded-2xl bg-grayC", {
                  "bg-secondaryC": focused,
                })}
              >
                <FontAwesome name="plus" size={20} color={color} />
              </View>
            ),
          }}
        />
      </Tabs>
      <StatusBar style="light" />
    </>
  );
};

export default TabsLayout;

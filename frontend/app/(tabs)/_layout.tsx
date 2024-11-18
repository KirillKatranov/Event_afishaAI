import React from 'react';
import {useTheme} from "@shopify/restyle";
import {Tabs} from "expo-router";
import {Theme} from "@/shared/providers/Theme";
import Icon from "@/shared/ui/Icons/Icon";

export default function TabLayout() {
  const theme = useTheme<Theme>();

  return (
    <Tabs screenOptions={{
      tabBarActiveTintColor: theme.colors.button_color,
      headerShown: false,
      tabBarShowLabel: false,
      tabBarStyle: {
        backgroundColor: theme.colors.bg_color,
        borderTopWidth: 0
      },
    }}
    >
      <Tabs.Screen
        name="feed"
        options={{
          tabBarIcon: ({color}) => <Icon name={"home"} size={24} color={color}/>,
        }}
      />

      <Tabs.Screen
        name="tags"
        options={{
          tabBarIcon: ({color}) => <Icon name={"tags"} size={24} color={color}/>,
        }}
      />

      <Tabs.Screen
        name="calendar"
        options={{
          tabBarIcon: ({color}) => <Icon name={"calendar"} size={24} color={color}/>,
        }}
      />

      <Tabs.Screen
        name="likes"
        options={{
          tabBarIcon: ({color}) => <Icon name={"like"} size={24} color={color}/>,
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          tabBarIcon: ({color}) => <Icon name={"user"} size={24} color={color}/>,
        }}
      />
    </Tabs>
  );
}

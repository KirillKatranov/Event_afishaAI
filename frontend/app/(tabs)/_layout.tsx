import React, {useEffect} from 'react';
import {useTheme} from "@shopify/restyle";
import {Tabs} from "expo-router";
import {Theme} from "@/shared/providers/Theme";
import Icon from "@/shared/ui/Icons/Icon";
import {useLikesStore} from "@/widgets/Likes";
import {useConfig} from "@/shared/providers/TelegramConfig";

export default function TabLayout() {
  const theme = useTheme<Theme>();

  const { fetchLikes } = useLikesStore();
  const username = useConfig().initDataUnsafe.user.username;

  useEffect(() => {
    fetchLikes(username);
  }, []);

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
        name="about"
        options={{
          tabBarIcon: ({color}) => <Icon name={"user"} size={24} color={color}/>,
        }}
      />
    </Tabs>
  );
}

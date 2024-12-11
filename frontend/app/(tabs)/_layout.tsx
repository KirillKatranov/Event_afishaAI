import React from 'react';
import {useTheme} from "@shopify/restyle";
import {Tabs} from "expo-router";
import {Theme} from "@/shared/providers/Theme";
import Icon from "@/shared/ui/Icons/Icon";
import {useSafeAreaInsets} from "@/shared/providers/SafeAreaWrapper";
import {Box} from "@/shared/ui";

export default function TabLayout() {
  const theme = useTheme<Theme>();
  const insets = useSafeAreaInsets();

  return (
    <Box
      flex={1}
      backgroundColor={"bg_color"}
      style={{
        paddingBottom: insets.bottom, paddingTop: insets.top,
        paddingLeft: insets.left, paddingRight: insets.right,
      }}
    >
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: theme.colors.button_color,
          headerShown: false,
          tabBarShowLabel: false,
          tabBarStyle: {
            backgroundColor: theme.colors.bg_color,
            borderTopWidth: 0,
          },
        }}
        sceneContainerStyle={{
          backgroundColor: theme.colors.bg_color,
        }}
      >
        <Tabs.Screen
          name="feed"
          options={{
            tabBarIcon: ({color}) => <Icon name={"home"} size={30} color={color}/>,
          }}
        />

        <Tabs.Screen
          name="tags"
          options={{
            tabBarIcon: ({color}) => <Icon name={"tags"} size={30} color={color}/>,
          }}
        />

        <Tabs.Screen
          name="calendar"
          options={{
            tabBarIcon: ({color}) => <Icon name={"calendar"} size={30} color={color}/>,
          }}
        />

        <Tabs.Screen
          name="likes"
          options={{
            tabBarIcon: ({color}) => <Icon name={"likeFilled"} size={28} color={color}/>,
          }}
        />

        <Tabs.Screen
          name="profile"
          options={{
            tabBarIcon: ({color}) => <Icon name={"user"} size={30} color={color}/>,
          }}
        />
      </Tabs>
    </Box>
  );
}

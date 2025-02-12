import React from 'react';
import {useTheme} from "@shopify/restyle";
import {Tabs, useSegments} from "expo-router";
import {Theme} from "@/shared/providers/Theme";
import Icon from "@/shared/ui/Icons/Icon";
import {useSafeAreaInsets} from "@/shared/providers/SafeAreaWrapper";
import {Box} from "@/shared/ui";
import { Pressable, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { useConfig } from '@/shared/providers/TelegramConfig';

export default function TabLayout() {
  const theme = useTheme<Theme>();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { initDataUnsafe } = useConfig();
  const segments = useSegments();

  const isCalendarScreen = segments.includes("calendar");

  return (
    <Box
      flex={1}
      backgroundColor={'bg_color'}

      style={{
        paddingBottom: insets.bottom, paddingTop: insets.top,
        paddingLeft: insets.left, paddingRight: insets.right,
      }}
    >
      <Tabs
        initialRouteName={"feed"}
        screenOptions={{
          tabBarActiveTintColor: theme.colors.text_color,
          tabBarInactiveTintColor: theme.colors.subtitle_text_color,
          headerShown: false,
          tabBarIconStyle: {
            color: "white"
          },
          tabBarStyle: {
            backgroundColor: theme.colors.bg_color,
            borderTopLeftRadius: 10, borderTopRightRadius: 10,
            paddingHorizontal: 32, marginTop: -10, height: 57,
          }
        }}
        sceneContainerStyle={{
          backgroundColor: theme.colors.bg_color,
        }}
      >
        <Tabs.Screen
          name="feed"
          options={{
            tabBarIcon: ({color}) => <Icon name={"home"} size={32} color={color}/>,
            tabBarShowLabel: false,
          }}
        />

        <Tabs.Screen
          name="tags"
          options={{
            tabBarIcon: ({color}) => <Icon name={"tags"} size={32} color={color}/>,
            tabBarShowLabel: false,
          }}
        />

        <Tabs.Screen
          name="likes"
          options={{
            tabBarIcon: ({color}) => <Icon name={"likeFilled"} size={32} color={color}/>,
            tabBarShowLabel: false,
          }}
        />

        <Tabs.Screen
          name="calendar"
          options={{
            tabBarIcon: ({color}) => <Icon name={"calendar"} size={32} color={color}/>,
            tabBarShowLabel: false,
          }}
        />
      </Tabs>

      {!isCalendarScreen && (
        <Pressable
          onPress={ () => { router.push("/profile") }}
          style={{
            zIndex: 3,
            position: "absolute",
            right: 20, top: 20,
          }}
        >
          <Image
            source={{ uri: initDataUnsafe.user.photo_url }}
            style={{
              width: 40,
              height: 40,
              borderRadius: 100,
            }}
          />
        </Pressable>
      )}
    </Box>
  );
}

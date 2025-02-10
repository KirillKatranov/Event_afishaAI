import React from 'react';
import {color, useTheme} from "@shopify/restyle";
import {Tabs} from "expo-router";
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

  return (
    <Box
      flex={1}
      backgroundColor={'bg_color'}

      style={{
        paddingBottom: insets.bottom, paddingTop: insets.top,
        paddingLeft: insets.left, paddingRight: insets.right,
        borderRadius: 10,
      }}
    >
      
      <Tabs
        initialRouteName={"feed"}
        screenOptions={{
          tabBarActiveTintColor: theme.colors.text_color,
          tabBarInactiveTintColor: theme.colors.subtitle_text_color,
          headerShown: false,
          tabBarShowLabel: true,
          tabBarIconStyle: {
            color: "white"
          },
          tabBarLabelStyle: {
            fontSize: 9,
            lineHeight: 16,
            color: theme.colors.text_color,
          },
          tabBarStyle: {
            backgroundColor: theme.colors.bg_color,
            display: "flex",
            flexDirection: "column",
            borderTopLeftRadius: 10,
            borderTopRightRadius: 10, 
            marginBottom: 0,
            borderTopWidth: 1,
            marginTop: -10,
            borderColor: theme.colors.bg_color
          }
        }}
        sceneContainerStyle={{
          backgroundColor: theme.colors.bg_color,
        }}
      >
        <Tabs.Screen
          name="feed"
          options={{
            tabBarIcon: ({color}) => <Icon name={"home"} size={30} color={color}/>,
            tabBarLabel: "Главная"
          }}
        />

        <Tabs.Screen
          name="tags"
          options={{
            tabBarIcon: ({color}) => <Icon name={"tags"} size={30} color={color}/>,
            tabBarLabel: "Категории"
          }}
        />

        <Tabs.Screen
          name="likes"
          options={{
            tabBarIcon: ({color}) => <Icon name={"likeFilled"} size={28} color={color}/>,
            tabBarLabel: "Избранное"
          }}
        />

        <Tabs.Screen
          name="calendar"
          options={{
            tabBarIcon: ({color}) => <Icon name={"calendar"} size={30} color={color}/>,
            tabBarLabel: "Календарь"
          }}
        />
      </Tabs>
      <Pressable
          onPress={ () => { router.push("/profile") }}
          style={{
            zIndex: 3,
            position: "absolute",
            right: 24,
            top: 24,
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
    </Box>
  );
}

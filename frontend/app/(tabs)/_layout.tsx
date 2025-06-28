import React, {useEffect, useState} from 'react';
import {useTheme} from "@shopify/restyle";
import {Tabs, useSegments} from "expo-router";
import {Theme} from "@/shared/providers/Theme";
import Icon from "@/shared/ui/Icons/Icon";
import {useSafeAreaInsets} from "@/shared/providers/SafeAreaWrapper";
import {Box} from "@/shared/ui";
import { Pressable, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { useConfig } from '@/shared/providers/TelegramConfig';
import {useEventCardStore} from "@/entities/event";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming
} from "react-native-reanimated";

export default function TabLayout() {
  const theme = useTheme<Theme>();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { initDataUnsafe } = useConfig();
  const segments = useSegments();

  // @ts-ignore
  const isCalendarScreen = segments.includes("calendar");

  const { likeTrigger } = useEventCardStore();

  const scale = useSharedValue(1);
  const [animation, setAnimation] = useState(false)

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: scale.value },
    ],
  }));

  useEffect(() => {
    if (likeTrigger > 0) {
      setAnimation(true)

      scale.value = withSequence(
        withTiming(1.4, { duration: 150 }),
        withSpring(1, { damping: 5, stiffness: 100 }, () => setAnimation(false))
      );
    }
  }, [likeTrigger]);

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
        screenOptions={{
          tabBarActiveTintColor: theme.colors.text_color,
          tabBarInactiveTintColor: theme.colors.subtitle_text_color,
          headerShown: false,
          tabBarStyle: {
            backgroundColor: theme.colors.bg_color,
            paddingHorizontal: 32, height: 57,
            borderTopWidth: 0,
          },
          tabBarItemStyle: { alignItems: 'center', flexDirection: 'row'},
          sceneStyle: {
            backgroundColor: theme.colors.bg_color,
          }
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
            tabBarIcon: ({ color }) => (
              <Animated.View style={animatedStyle}>
                <Icon
                  name={"likeFilled"}
                  size={24}
                  color={
                    color === theme.colors.text_color ?
                      color :
                      animation ? theme.colors.red : theme.colors.subtitle_text_color
                  }
                />
              </Animated.View>
            ),
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

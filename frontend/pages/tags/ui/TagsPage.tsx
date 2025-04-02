import React, {useCallback} from "react";
import { Box} from "@/shared/ui";
import { TagsHeader } from "@/pages/tags/ui/TagsHeader";
import {TagsList, useTagsStore} from "@/widgets/tags-list";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  interpolate,
  useAnimatedScrollHandler,
} from "react-native-reanimated";
import {useFocusEffect, useLocalSearchParams} from "expo-router";
import {Services, ServicesColors} from "@/entities/service";
import {BlurView} from "expo-blur";
import {useTheme} from "@shopify/restyle";
import {Theme} from "@/shared/providers/Theme";
import {getTint} from "@/shared/constants";
import {Dimensions} from "react-native";
import {useConfig} from "@/shared/providers/TelegramConfig";

const window = Dimensions.get("window");

export const TagsPage = () => {
  const theme = useTheme<Theme>();
  const { service } = useLocalSearchParams<{ service: "events" | "places" | "organizers" | "trips" }>()

  const username = useConfig().initDataUnsafe.user.username;
  const { isLoading, fetchTags } = useTagsStore();
  useFocusEffect(
    useCallback(() => {
      fetchTags({ username: username, macro_category: service });
    }, [])
  )

  const scrollY = useSharedValue(0);

  const onScroll = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  const headerStyle = useAnimatedStyle(() => {
    const translateY = interpolate(
      scrollY.value,
      [0, 300],
      [0, 100],
      'clamp'
    );

    return {
      transform: [{ translateY: translateY }],
    };
  });

  const gradientStyle = useAnimatedStyle(() => {
    const translateY = interpolate(
      scrollY.value,
      [0, 250],
      [0, 100],
      'clamp'
    );

    return { top: -(window.height * 0.05) - translateY };
  });

  const tint = getTint(theme.colors.bg_color);

  return (
    <Box flex={1} backgroundColor={"bg_color"} alignItems={"center"}>
      <BlurView intensity={tint == "dark" ? 70 : 100} tint={tint} style={{ width: "100%", height: "100%", zIndex: 1 }}>
        <Animated.ScrollView
          onScroll={onScroll}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 20, flexGrow: 1 }}
          scrollEnabled={!isLoading}
        >
          {/* Parallax Header */}
          <Animated.View style={[headerStyle]}>
            <TagsHeader
              title={Services.find((ser) => ser.id == service)?.name as string}
              service={service}
            />
          </Animated.View>

          <TagsList scrollY={scrollY}/>
        </Animated.ScrollView>
      </BlurView>

      <Animated.View
        style={[{
          backgroundColor: ServicesColors[service], opacity: 0.75,
          position: "absolute", zIndex: -1,
          width: window.height * 0.1,
          height: window.height * 0.1,
          borderRadius: window.height * 0.1 / 2,
          transform: [{ scaleX: window.width / (window.height * 0.1) }],
        }, gradientStyle]}
      />
    </Box>
  );
};

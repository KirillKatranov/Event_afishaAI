import React, {useCallback} from "react";
import {StyleSheet} from "react-native";
import { Box} from "@/shared/ui";
import { TagsHeader } from "@/pages/tags/ui/TagsHeader";
import {TagsList, useTagsStore} from "@/widgets/tags-list";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  interpolate,
  useAnimatedScrollHandler,
} from "react-native-reanimated";
import {useFocusEffect, useLocalSearchParams, useRouter} from "expo-router";
import {useConfig} from "@/shared/providers/TelegramConfig";
import {LinearGradient} from "expo-linear-gradient";
import {ServicesColors} from "@/entities/service";

export const TagsPage = () => {
  const { service } = useLocalSearchParams<{ service: "events" | "places" | "organizers" | "trips" }>()
  const { BackButton } = useConfig();
  const router = useRouter();

  const { isLoading } = useTagsStore();

  useFocusEffect(
    useCallback(() => {
      if (BackButton) {
        BackButton.show();
        BackButton.onClick(() => router.navigate("/tags"));
        return () => BackButton.hide();
      }

      return () => console.log("End focus");
    }, [])
  );

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

  return (
    <Box flex={1} backgroundColor="bg_color">
      <Animated.ScrollView
        onScroll={onScroll}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20, flexGrow: 1 }}
        scrollEnabled={!isLoading}
      >
        <LinearGradient
          colors={["#FFFFFF", ServicesColors[service]]}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={{...StyleSheet.absoluteFillObject, marginTop: -110}}
        />

        {/* Parallax Header */}
        <Animated.View style={[headerStyle]}>
          <TagsHeader />
        </Animated.View>

        <TagsList scrollY={scrollY}/>
      </Animated.ScrollView>
    </Box>
  );
};

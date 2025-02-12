import React from "react";
import { Box} from "@/shared/ui";
import { TagsHeader } from "@/pages/tags/ui/TagsHeader";
import {TagsList, useTagsStore} from "@/widgets/tags-list";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  interpolate,
  useAnimatedScrollHandler,
} from "react-native-reanimated";
import {useLocalSearchParams} from "expo-router";
import {Services} from "@/entities/service";


export const TagsPage = () => {
  const { service } = useLocalSearchParams<{ service: "events" | "places" | "organizers" | "trips" }>()

  const { isLoading } = useTagsStore();

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
    <Box flex={1} backgroundColor={"bg_color"}>
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
    </Box>
  );
};

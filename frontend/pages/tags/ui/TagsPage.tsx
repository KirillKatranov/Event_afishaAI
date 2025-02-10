import React from "react";
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
import {useLocalSearchParams, useRouter} from "expo-router";
import {LinearGradient} from "expo-linear-gradient";
import {ServicesColors} from "@/entities/service";
import { Pressable, Image } from "react-native";
import {useConfig} from "@/shared/providers/TelegramConfig";


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

  const router = useRouter();
  const { initDataUnsafe } = useConfig();

  return (
    <Box flex={1} backgroundColor="bg_color">
      <Pressable
        onPress={ () => { router.replace("/profile") }}
        style={{
          zIndex: 3,
        }}
      >
        <Image
          source={{ uri: initDataUnsafe.user.photo_url }}
          style={{
            position: "absolute",
            width: 40,
            height: 40,
            borderRadius: 100,
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-end",
            zIndex: 3,
            marginTop: 24, 
            marginRight: 24,
            right: 0,
          }}
        />
      </Pressable>
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

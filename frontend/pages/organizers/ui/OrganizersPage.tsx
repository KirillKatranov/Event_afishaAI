import React from "react";
import {ScrollView, Dimensions} from "react-native";
import {OrganizersList} from "@/widgets/organizers-list";
import Animated, {interpolate, useAnimatedStyle, useSharedValue} from "react-native-reanimated";
import {ServicesColors} from "@/entities/service";
import {BlurView} from "expo-blur";
import {TagsHeader} from "@/widgets/tags-list";

const window = Dimensions.get("window");

export const OrganizersPage = () => {
  const scrollY = useSharedValue(0);

  const gradientStyle = useAnimatedStyle(() => {
    const translateY = interpolate(
      scrollY.value,
      [0, 250],
      [0, 100],
      'clamp'
    );

    return { top: -(window.height * 0.05) - translateY };
  });

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      style={{ flex: 1, backgroundColor: "white" }}
      contentContainerStyle={{ flexGrow: 1, minHeight: '100%', alignItems: "center" }}
    >
      <Animated.View
        style={[{
          backgroundColor: ServicesColors["organizers"], opacity: 0.75,
          position: "absolute", zIndex: -1,
          width: window.height * 0.1,
          height: window.height * 0.1,
          borderRadius: window.height * 0.1 / 2,
          transform: [{ scaleX: window.width / (window.height * 0.1) }],
        }, gradientStyle]}
      />

      <BlurView intensity={100} style={{ width: "100%", height: "100%", zIndex: 1, gap: 16, }}>
        <TagsHeader title={"Организаторы"} service={"organizers"}/>

        <OrganizersList/>
      </BlurView>
    </ScrollView>
  );
};

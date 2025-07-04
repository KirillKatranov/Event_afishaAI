import React from "react";
import {Dimensions, Pressable, View} from "react-native";
import {OrganizersList} from "@/widgets/organizers-list";
import Animated, {
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue
} from "react-native-reanimated";
import {ServicesGradients} from "@/entities/service";
import {BlurView} from "expo-blur";
import {Text} from "@/shared/ui";
import Icon from "@/shared/ui/Icons/Icon";
import DropShadow from "react-native-drop-shadow";
import {useRouter} from "expo-router";
import {useTheme} from "@shopify/restyle";
import {Theme} from "@/shared/providers/Theme";
import {LinearGradient} from "expo-linear-gradient";

const window = Dimensions.get("window");

export const OrganizersPage = () => {
  const scrollY = useSharedValue(0);

  const router = useRouter();
  const theme = useTheme<Theme>();

  const gradientStyle = useAnimatedStyle(() => {
    const translateY = interpolate(
      scrollY.value,
      [0, 250],
      [0, 100],
      'clamp'
    );

    return { top: -(window.height * 0.05) - translateY };
  });

  const onScroll = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  return (
    <Animated.ScrollView
      onScroll={onScroll}
      showsVerticalScrollIndicator={false}
      style={{ flex: 1, backgroundColor: "white" }}
      contentContainerStyle={{ flexGrow: 1, minHeight: '100%', alignItems: "center" }}
    >
      <Animated.View
        style={[{
          opacity: 0.6,
          position: "absolute", zIndex: -1,
          width: window.height * 0.1,
          height: window.height * 0.1,
          borderRadius: window.height * 0.1 / 2,
          transform: [{ scaleX: window.width / (window.height * 0.1) }], overflow: "hidden"
        }, gradientStyle]}
      >
        <LinearGradient
          colors={[ServicesGradients["organizers"][0], ServicesGradients["organizers"][1]]}
          start={{ x: 0, y: 0}} end={{ x: 1, y: 0 }}
          style={{ flex: 1 }}
        />
      </Animated.View>

      <BlurView intensity={100} style={{ width: "100%", height: "100%", zIndex: 1, gap: 16, }}>
        <DropShadow
          style={{
            shadowOffset: {width: 2, height: 2},
            shadowColor: "rgba(0,0,0,0.25)",
            shadowRadius: 8,
            paddingBottom: 12, paddingTop: 75, borderBottomStartRadius: 20, borderBottomEndRadius: 20,
          }}
        >
          <Pressable
            onPress={() => { router.replace("/tags") }}
            style={{ position: "absolute", zIndex: 1, top: 20, left: 20 }}
          >
            <View style={{ width: 40, height: 40, borderRadius: 50, alignItems: "center", justifyContent: "center" }}>
              <Icon name={"chevronLeft"} color={theme.colors.text_color} size={24}/>
            </View>
          </Pressable>

          <Text style={{ fontFamily: "TDMars", fontWeight: "500", fontSize: 22, textAlign: "center", color: theme.colors.black }}>
            ОРГАНИЗАТОРЫ
          </Text>
        </DropShadow>

        <OrganizersList scrollY={scrollY}/>
      </BlurView>
    </Animated.ScrollView>
  );
};

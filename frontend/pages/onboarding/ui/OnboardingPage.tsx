import React, { useEffect } from "react";
import Animated, {interpolate, useAnimatedStyle, useSharedValue, withTiming} from "react-native-reanimated";
import { OnboardingIllustration, OnboardingNav, OnboardingText, useOnboardingStore } from "@/widgets/onboarding-elements";
import { Box } from "@/shared/ui";
import { Dimensions, ImageBackground } from "react-native";
import {GestureDetector, Gesture, GestureHandlerRootView} from 'react-native-gesture-handler';
import {useLocalSearchParams, useRouter} from "expo-router";

const width = Dimensions.get("window").width;

export const OnboardingPage: React.FC = () => {
  const { user } = useLocalSearchParams<{ user: string }>();

  const backgroundAnimation = useSharedValue(0);
  const offsetX = useSharedValue(0);
  const startX = useSharedValue(0);

  let { page, incPage, decPage } = useOnboardingStore();

  useEffect(() => {
    backgroundAnimation.value = withTiming(page - 1, { duration: 400 });
  }, [page]);

  const router = useRouter();

  const swipeGestureHandler = Gesture.Pan()
    .onStart(() => {
      startX.value = offsetX.value;
    })
    .onUpdate((e) => {
      offsetX.value = startX.value + e.translationX;
    })
    .onEnd((e) => {
      const { velocityX } = e;
      if ((velocityX < -150) && page < 3 && page >= 1) {
        offsetX.value = withTiming(-width, { duration: 200 }, () => {
          incPage();
          offsetX.value = 0;
        });
      } else if (velocityX > 150 && page > 1 && page <= 3) {
        offsetX.value = withTiming(width, { duration: 200 }, () => {
          decPage();
          offsetX.value = 0;
        });
      } else if ((velocityX < -150) && page === 3) {
        router.replace({pathname: "/onboarding/city", params: { user: user }})
      } else {
        offsetX.value = withTiming(0, { duration: 200 });
      }
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: offsetX.value }],
  }));

  const backgroundStyle1 = useAnimatedStyle(() => ({
    opacity: interpolate(backgroundAnimation.value, [0, 1, 2], [1, 0, 0]),
  }));

  const backgroundStyle2 = useAnimatedStyle(() => ({
    opacity: interpolate(backgroundAnimation.value, [0, 1, 2], [0, 1, 0]),
  }));

  const backgroundStyle3 = useAnimatedStyle(() => ({
    opacity: interpolate(backgroundAnimation.value, [0, 1, 2], [0, 0, 1]),
  }));

  return (
    <GestureHandlerRootView>
      <GestureDetector gesture={swipeGestureHandler}>
        <Box style={{ flex: 1, position: "absolute", width: "100%", height: "100%" }}>
          {/* First Background */}
          <Animated.View style={[{ position: "absolute", width: "100%", height: "100%" }, backgroundStyle1]}>
            <ImageBackground source={require("@/shared/assets/images/onboardingBackgroundPage1.png")} resizeMode={"stretch"} style={{ flex: 1, width: "100%", height: "100%" }} />
          </Animated.View>

          {/* Second Background */}
          <Animated.View style={[{ position: "absolute", width: "100%", height: "100%" }, backgroundStyle2]}>
            <ImageBackground source={require("@/shared/assets/images/onboardingBackgroundPage2.png")}  resizeMode={"stretch"} style={{ flex: 1, width: "100%", height: "100%" }} />
          </Animated.View>

          {/* Third Background */}
          <Animated.View style={[{ position: "absolute", width: "100%", height: "100%" }, backgroundStyle3]}>
            <ImageBackground source={require("@/shared/assets/images/onboardingBackgroundPage3.png")}  resizeMode={"stretch"} style={{ flex: 1, width: "100%", height: "100%" }} />
          </Animated.View>


          <Animated.View style={[{ flex: 1 }, animatedStyle]}>
            <Box
              flex={1}
              justifyContent={"flex-end"}
              overflow={"hidden"}
              style={{
                gap: 36
              }}
            >
              <OnboardingIllustration />

              <OnboardingText/>

              <OnboardingNav />
            </Box>
          </Animated.View>
        </Box>
      </GestureDetector>
    </GestureHandlerRootView>
  )
}

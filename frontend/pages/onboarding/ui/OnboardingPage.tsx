import React, { useEffect } from "react";
import Animated, {useSharedValue, withTiming} from "react-native-reanimated";
import {OnboardingIllustration, OnboardingNav, OnboardingText, useOnboardingStore} from "@/widgets/onboarding-elements";
import {Box} from "@/shared/ui";
import { ImageBackground } from "react-native";
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import { useRouter } from "expo-router";

export const OnboardingPage: React.FC = () => {
  const backgroundAnimation = useSharedValue(0)
  const offsetX = useSharedValue(0)
  const startX = useSharedValue(0)

  let { page, incPage, decPage } = useOnboardingStore();

  useEffect(() => {
    backgroundAnimation.value = withTiming(page, { duration: page == 1 ? 0 : 400 });
  }, [page]);

  const router = useRouter()

  let direction = '';

  const swipeGestureHandler = Gesture.Pan()
    .onStart(() => {
      startX.value = offsetX.value
    })
    .onUpdate((e) => {
      offsetX.value = startX.value + e.translationX
    })
    .onEnd((e) => {
      const { velocityX } = e;
      console.log(e)
      if ((velocityX < -150) && page < 3 && page >= 1) {
        direction = 'left';
        offsetX.value = withTiming(100, { duration: 200 }, () => {
          incPage()
          offsetX.value = withTiming(0)
        })
      }
      else if (velocityX > 150 && page > 1 && page <= 3) {
        direction = 'right';
        offsetX.value = withTiming(-100, { duration: 200 }, () => {
          decPage()
          offsetX.value = withTiming(0)
        })
      }
      else if ((velocityX < -150) && page === 3) {
        router.replace("/(tabs)/feed")
      }
      else {
        offsetX.value = withTiming(0)
      }
    })

  const backgroundImage = `../../../shared/assets/images/onboardingBackgroundPage`;

  return (
    <GestureDetector gesture={swipeGestureHandler}>
      <ImageBackground
        source={page === 1 ? require(backgroundImage + '1.png') : (page === 2 ? require(backgroundImage + '2.png') : require(backgroundImage + '3.png'))}
        style={{
          position: "absolute",
          width: "100%",
          height: "100%"
        }}
      >
        <Animated.View
          style={[
            {
              flex: 1
            }
          ]}
        >
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
      </ImageBackground>
    </GestureDetector>
  )
}

import React, {useEffect, useState} from "react";
import {Box} from "@/shared/ui";
import {Text} from "@/shared/ui";
import {useOnboardingStore} from "@/widgets/Onboarding/model/store/useOnboardingStore";
import Illustration from "@/shared/ui/Illustrations/Illustration";
import Animated, {runOnJS, useAnimatedStyle, useSharedValue, withTiming} from "react-native-reanimated";

export const OnboardingIllustration = () => {
  const { page } = useOnboardingStore();
  const [pageSubTick, setPageSubTick] = useState(page);

  const opacity = useSharedValue(1);

  useEffect(() => {
    if (page != 1) {
      opacity.value = withTiming(0, { duration: 200 }, () => {
        runOnJS(setPageSubTick)(page);
        opacity.value = withTiming(1, { duration: 200 });
      });
    } else {
      opacity.value = withTiming(1, { duration: 200 }, () => runOnJS(setPageSubTick)(page));
    }
  }, [page]);

  const animatedOpacity = useAnimatedStyle(() => ({
    opacity: opacity.value,
    flex: 1
  }));

  if (pageSubTick == 1) {
    return (
      <Animated.View
        style={[
          animatedOpacity,
          {
            position: "absolute",
            width: "100%",
            height: "100%",
          }
        ]}
      >
        <Box
          position={"absolute"}
          width={"100%"}
          top={0}
          zIndex={-1}
        >
          <Illustration name={"topLine"} width={"100%"}/>
        </Box>

        <Text
          variant={"onboardingHello"}
          color={"toxicBlue"}
          style={{
            position: "absolute",
            top: 16,
            left: 36
          }}
        >
          { "ПРИВЕТ!" }
        </Text>

        <Box
          position={"absolute"}
          backgroundColor={"toxicBlue"}
          top={94}
          left={76}
          right={0}
          style={{
            borderTopLeftRadius: 25,
            borderBottomLeftRadius: 25,
            paddingHorizontal: 42,
            paddingVertical: 32
          }}
        >
          <Text
            variant={"onboardingIam"}
            color={"lime"}
          >
            { "Я — Стрелка, твой гид и помощник в поиске мероприятий" }
          </Text>
        </Box>


        <Illustration name={"arrow"} height={"100%"}/>

        <Box
          position={"absolute"}
          width={"100%"}
          bottom={0}
          zIndex={-1}
        >
          <Illustration name={"bottomLine"} width={"100%"}/>
        </Box>
      </Animated.View>
    )
  }

  if (pageSubTick == 2) {
    return (
      <Animated.View style={animatedOpacity}>
        <Box
          flex={1}
          paddingHorizontal={"xl"}
          justifyContent={"center"}
          alignItems={"center"}
        >
          <Illustration name={"like"} width={"100%"} height={"100%"}/>
        </Box>
      </Animated.View>
    )
  }

  {/* page == 3 */}
  return (
    <Animated.View style={animatedOpacity}>
      <Box
        flex={1}
        paddingHorizontal={"xl"}
        justifyContent={"center"}
        alignItems={"center"}
      >
        <Illustration name={"calendar"} width={"100%"} height={"100%"}/>
      </Box>
    </Animated.View>
  )
}

import React, {useEffect, useState} from "react";
import Animated, {runOnJS, useAnimatedStyle, useSharedValue, withTiming} from "react-native-reanimated";
import { useOnboardingStore } from "@/widgets/onboarding-elements/model/store/useOnboardingStore";
import { Box, Text } from "@/shared/ui";

export const OnboardingText: React.FC = () => {
  const { page, pageTitle, pageSubtitle, setPageText } = useOnboardingStore();
  const [pageSubTick, setPageSubTick] = useState(page);

  const opacity = useSharedValue(1);

  useEffect(() => {
    if (page != 1) {
      opacity.value = withTiming(0, { duration: 200 }, () => {
        runOnJS(setPageSubTick)(page);
        runOnJS(setPageText)();
        opacity.value = withTiming(1, { duration: 200 });
      });
    } else {
      opacity.value = withTiming(1, { duration: 200 }, () => {
        runOnJS(setPageSubTick)(page);
        runOnJS(setPageText)();
      });
    }
  }, [page]);

  const animatedOpacity = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={animatedOpacity}
    >
      <Box
        style={{
          gap: 20,
          paddingHorizontal: 40
        }}
      >
        <Text
          variant={"onboardingTitle"}
          textAlign={"center"}
          color={ pageSubTick == 2 ? "lime" : "totalBlack" }
        >
          {pageTitle}
        </Text>

        <Text
          variant={"onboardingSubtitle"}
          textAlign={"center"}
          color={ pageSubTick == 2 ? "white" : "totalBlack" }
        >
          {pageSubtitle}
        </Text>
      </Box>
    </Animated.View>
  );
};

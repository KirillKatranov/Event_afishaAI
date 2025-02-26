import React, {useEffect, useState} from "react";
import Animated, {runOnJS, useAnimatedStyle, useSharedValue, withTiming} from "react-native-reanimated";
import { useOnboardingStore } from "@/widgets/onboarding-elements/model/store/useOnboardingStore";
import { Box, Text } from "@/shared/ui";

export const OnboardingText: React.FC = () => {
  const { page, pageSubtitle, setPageText } = useOnboardingStore();
  const [text, setText] = useState('для тебя')

  const opacity = useSharedValue(0);
  useEffect(() => {
    opacity.value = withTiming(0, { duration: 0 }, () => {
      runOnJS(setPageText)();
      setText(page == 1 ? 'для тебя' : (page == 2 ? 'под рукой' : ''));
      opacity.value = withTiming(1, { duration: 250 });
    });
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
        <Box
          style={{
            backgroundColor: "#E1F44B",
            borderRadius: 25,
            padding: 10,
          }}
        >
          <Text
            variant={"onboardingSubtitle"}
            textAlign={"center"}
            color={"black" }
            fontSize={14}
            fontWeight={400}
            lineHeight={20}
          >
            {pageSubtitle} <Text fontWeight={800} color={"totalBlack"}>{text}</Text>
          </Text>
        </Box>
      </Box>
    </Animated.View>
  );
};

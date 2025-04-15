import React, {useEffect} from "react";
import Animated, {runOnJS, useAnimatedStyle, useSharedValue, withTiming} from "react-native-reanimated";
import { useOnboardingStore } from "@/widgets/onboarding-elements/model/store/useOnboardingStore";
import {Box, Text, GradientText} from "@/shared/ui";
import {LinearGradient} from "expo-linear-gradient";

export const OnboardingText: React.FC = () => {
  const { page, pageSubtitle, setPageText } = useOnboardingStore();

  const opacity = useSharedValue(0);
  useEffect(() => {
    opacity.value = withTiming(0, { duration: 0 }, () => {
      runOnJS(setPageText)();
      opacity.value = withTiming(1, { duration: 250 });
    });
  }, [page]);

  const animatedOpacity = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={[
        animatedOpacity,
        { flex: 1, gap: 16 }
      ]}
    >
      <Box flex={1}>
        {page == 1 && (
          <Box flex={1} style={{ alignItems: "center", justifyContent: "space-evenly"}}>
            <GradientText
              id={"page1MainText"}
              colors={["#E1F44B", "#E600FF", "#8E00FF"]} stops={[0.13, 0.48, 1]}
              text={"1000"} fontSize={96} textStyle={{ fontFamily: "UnboundedExtraBold" }}
              gradientStop={{ x: 1, y: 1 }}
            />

            <Box style={{ backgroundColor: "#8E00FF", borderRadius: 25, padding: 10, height: 45, justifyContent: "center" }}>
              <Text fontFamily={"UnboundedSemiBold"} fontSize={32} color={"white"}>
                МЕРОПРИЯТИЙ
              </Text>
            </Box>
          </Box>
        )}

        {page == 2 && (
          <Box flex={1} style={{ alignItems: "center", justifyContent: "space-evenly"}}>
            <GradientText
              id={"page2MainText"}
              colors={["#E1F44B", "#E600FF", "#8E00FF"]} stops={[0.19, 0.6, 1]}
              text={"10+"} fontSize={128} textStyle={{ fontFamily: "UnboundedExtraBold" }}
              gradientStop={{ x: 1, y: 1 }}
            />

            <Box style={{ backgroundColor: "#FF00FF", borderRadius: 25, padding: 10, height: 45, justifyContent: "center" }}>
              <Text fontFamily={"UnboundedSemiBold"} fontSize={32} color={"white"}>
                КАТЕГОРИЙ
              </Text>
            </Box>
          </Box>
        )}

        {page == 3 && (
          <Box flex={1} style={{ alignItems: "center", justifyContent: "center", paddingHorizontal: 30 }}>
            <GradientText
              id={"page3MainText"}
              colors={["#E600FF", "#C700FF", "#8E00FF", "#6F01C7"]}
              stops={[0, 0.4, 0.81, 1]}
              text={"ТУРЫ\nБИЛЕТЫ\nМАРШРУТЫ"} textAlign={"left"} fontSize={40} textStyle={{ fontFamily: "UnboundedExtraBold" }}
            />
          </Box>
        )}

        {page == 4 && (
          <Box flex={1} style={{ alignItems: "center", justifyContent: "center", gap: 24 }}>
            <LinearGradient
              colors={["#BA00FF", "#8E00FF", "#6F01C7"]}
              locations={[0, 0.5, 1]}
              style={{ backgroundColor: "#8E00FF", borderRadius: 25, padding: 10, height: 45, justifyContent: "center" }}
            >
              <Text fontFamily={"UnboundedSemiBold"} fontSize={32} color={"white"}>
                НАЧИНАЙ
              </Text>
            </LinearGradient>

            <GradientText
              id={"page4MainText"}
              colors={["#F064A8", "#E600FF", "#8E00FF", "#6F01C7"]}
              stops={[0, 0.49, 0.84, 1]}
              text={"СВОЁ"} textAlign={"center"} fontSize={64} textStyle={{ fontFamily: "UnboundedExtraBold" }}
            />
          </Box>
        )}
      </Box>

      <GradientText
        id={"pageSubText"}
        colors={["#FF00FF", "#E600FF", "#8E00FF", "#6F01C7"]} stops={[0, 0.21, 0.66, 1]}
        text={pageSubtitle} fontSize={24} textStyle={{ fontFamily: "MontserratSemiBold" }}
      />
    </Animated.View>
  );
};

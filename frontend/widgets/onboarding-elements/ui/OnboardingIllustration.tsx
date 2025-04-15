import React, {useEffect, useState} from "react";
import Animated, {runOnJS, useAnimatedStyle, useSharedValue, withTiming} from "react-native-reanimated";
import {useOnboardingStore} from "@/widgets/onboarding-elements/model/store/useOnboardingStore";
import {Box} from "@/shared/ui";
import {Text} from "@/shared/ui";
import {LinearGradient} from "expo-linear-gradient";

export const OnboardingIllustration = () => {
  const { page } = useOnboardingStore();
  const [pageSubTick, setPageSubTick] = useState(page);
  const opacity = useSharedValue(0);

  useEffect(() => {
    opacity.value = withTiming(0, { duration: 0 }, () => {
      runOnJS(setPageSubTick)(page);
      opacity.value = withTiming(1, { duration: 250 });
    })
  }, [page]);

  const animatedOpacity = useAnimatedStyle(() => ({
    opacity: opacity.value
  }));

  return (
    <Box style={ { marginTop: 100, gap: 16, height: 72, width: "100%" }}>
      <Animated.View
        style={[
          animatedOpacity,
          { alignSelf: "center", justifyContent: "center", width: "100%", height: "100%", zIndex: 2 },
        ]}
      >
        <Text
          textAlign={"center"}
          style={{
            color: "#ffffff",
            fontFamily: 'UnboundedSemiBold',
            fontSize: 36
          }}
        >
          {pageSubTick == 1 ?
            "СОБЫТИЯ" :
            (pageSubTick == 2 ?
                "МЕСТА" :
                (pageSubTick == 3 ?
                    "ПУТЕШЕСТВИЯ" :
                    "ОРГАНИЗАТОРЫ"
                )
            )
          }
        </Text>
      </Animated.View>

      <LinearGradient
        colors={["#E1F44B", "#E600FF", "#C500FF", "#8E00FF"]}
        locations={[0, 0.5, 0.78, 1]}
        start={{ x: 0.3, y: 0.5 }}
        end={{ x: 0.5, y: 1 }}
        style={{
          position: "absolute", zIndex: 1,
          width: "100%", height: "100%"
        }}
      />
    </Box>
  )
}

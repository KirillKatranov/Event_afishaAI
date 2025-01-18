import React, {useEffect, useState} from "react";
import Animated, {runOnJS, useAnimatedStyle, useSharedValue, withTiming} from "react-native-reanimated";
import {useOnboardingStore} from "@/widgets/onboarding-elements/model/store/useOnboardingStore";
import Illustration from "@/shared/ui/Illustrations/Illustration";
import {Box} from "@/shared/ui";
import {Text} from "@/shared/ui";

export const OnboardingIllustration = () => {
  const { page, pageTitle } = useOnboardingStore();
  const [pageSubTick, setPageSubTick] = useState(page);
  const opacity = useSharedValue(0);

  useEffect(() => {
    if (page != 1) {
      opacity.value = withTiming(0, { duration: 250 }, () => {
        runOnJS(setPageSubTick)(page);
        opacity.value = withTiming(1, { duration: 250 });
      });
    } else {
      opacity.value = withTiming(0, { duration: 250 }, () => {
        runOnJS(setPageSubTick)(page);
        opacity.value = withTiming(1, { duration: 250 })
      })
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
          top={100}
          alignSelf={"center"}
        >
          <Text variant={"onboardingIam"} style={{ color: "#000000" }}>
            ВЫБИРАЙ ИЗ{" "}
            <Text style={{ color: "#8E00FF" }}>10 КАТЕГОРИЙ</Text>
          </Text>
          <Box
            style={{
              marginTop: 30,
              marginLeft: 35,
              gap: 10
            }}
          >
            <Box
              style={{
                display: "flex",
                justifyContent: "flex-start"
              }}
            >
              <Text fontWeight={600} variant={"tagsHeaderQuestion"}>— ОТ КОНЦЕРТОВ</Text>
            </Box>
            <Box
              style={{
                marginLeft: 160
              }}
            >
              <Text fontWeight={600} variant={"tagsHeaderQuestion"}>ДО ВЫСТАВОК</Text>
            </Box>
          </Box>
        </Box>

        <Box
          height={"100%"}
          style={{
            flex: 1,
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            position: "relative"
          }}
        >
          <Illustration name={"firstPageArrow"}/>
        </Box>

      </Animated.View>
    )
  }

  if (pageSubTick == 2) {
    return (
      <Animated.View style={[
        animatedOpacity,
        {
          position: "absolute",
          height: "100%",
          width: "100%"
        }
      ]}>
        <Box
          position={"absolute"}
          top={92}
          alignSelf={"center"}
          zIndex={2}
        >
          <Text
            variant={"onboardingTitle"}
            textAlign={"center"}
            lineHeight={34}
            style={{
              color: "#000000",

            }}
          >
            {pageTitle}
          </Text>
        </Box>

        <Box
          flex={1}
          justifyContent={"center"}
          alignItems={"center"}
          style={{
            marginBottom: 93
          }}
        >
          <Box
            style={{
              position: "relative",
              right: 5,
            }}
          >
            <Illustration name={"onboardingLike"}/>
          </Box>
          <Box
            style={{
              display: "flex",
              alignItems: "center",
              position: "relative",
              right: 15,
            }}
          >
            <Illustration name={"onboardingLikes"}/>
          </Box>
          <Illustration name={"secondPageArrow"}/>
        </Box>
      </Animated.View>
    )
  }

  {/* page == 3 */}
  return (
    <Animated.View style={[
      animatedOpacity,
      {
        position: "absolute",
        height: "100%",
        width: "100%"
      }
    ]}>
      <Box
        position={"absolute"}
        top={100}
        alignSelf={"center"}
      >
        <Text
          variant={"onboardingTitle"}
          textAlign={"center"}
          lineHeight={34}
          style={{
            color: "#000000"
          }}
        >
          {pageTitle}
        </Text>
      </Box>
      <Box
        flex={1}
        paddingHorizontal={"xl"}
        flexDirection={"row"}
        justifyContent={"center"}
        alignItems={"center"}
        style={{
          marginBottom: 60
        }}
      >
        <Illustration name={"thirdPageArrow"}/>
      </Box>
    </Animated.View>
  )
}

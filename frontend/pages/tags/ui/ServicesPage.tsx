import React from "react";
import Animated, {
  interpolateColor, useAnimatedStyle,
  useSharedValue
} from "react-native-reanimated";
import {ServiceCard, Services, ServicesColors} from "@/entities/service";
import {useRouter} from "expo-router";
import Carousel from "react-native-reanimated-carousel/src/components/Carousel";
import {Dimensions} from "react-native";
import {BlurView} from "expo-blur";
import {Box} from "@/shared/ui";

const window = Dimensions.get("window");

export const ServicesPage = () => {
  const router = useRouter();

  const swipeProgress = useSharedValue(0);

  const animatedBackgroundStyle = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      swipeProgress.value,
      [0, 1, 2, 3, 4],
      [...Object.values(ServicesColors), Object.values(ServicesColors)[0]],
      'RGB', { gamma: 2 }
    );

    return { backgroundColor, opacity: 0.75 };
  });

  return (
    <Box backgroundColor={"white"} style={[{ flex: 1, alignItems: "center", justifyContent: "center" }]}>
      <BlurView
        intensity={100}
        style={{ width: "100%", height: "100%", alignItems: "center", justifyContent: "center" }}
      >
        <Carousel
          autoPlayInterval={2000}
          data={Services}
          loop={true}
          pagingEnabled={true}
          snapEnabled={true}
          width={window.width * 0.9}
          height={Math.min(window.height - 64, 550)}
          style={{
            zIndex: 1, overflow: "visible",
          }}
          mode="parallax"
          modeConfig={{
            parallaxScrollingScale: 0.9,
            parallaxScrollingOffset: window.width * 0.1,
            parallaxAdjacentItemScale: 0.8
          }}
          onProgressChange={swipeProgress}
          renderItem={({item}) => <ServiceCard service={item} onPress={() => {
            if (item.id != "organizers" && item.id != "trips") {
              router.push({
                pathname: '/tags/[service]',
                params: { service: item.id }
              })
            }
          }}/>}
        />
      </BlurView>

      <Animated.View
        style={[
          {
            position: "absolute", zIndex: -1,
            top: -(window.height * 0.05),
            width: window.height * 0.1,
            height: window.height * 0.1,
            borderRadius: window.height * 0.1 / 2,
            transform: [{ scaleX: window.width / (window.height * 0.1) }],
          },
          animatedBackgroundStyle,
        ]}
      />

      <Animated.View
        style={[
          {
            position: "absolute", zIndex: -1,
            bottom: -(window.height * 0.025),
            width: window.height * 0.05,
            height: window.height * 0.05,
            borderRadius: window.height * 0.05 / 2,
            transform: [{ scaleX: window.width / (window.height * 0.05) }],
          },
          animatedBackgroundStyle,
        ]}
      />
    </Box>
  )
}

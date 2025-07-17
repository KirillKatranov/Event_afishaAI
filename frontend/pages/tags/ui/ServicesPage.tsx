import React, {useCallback, useState} from "react";
import {
  interpolateColor, runOnJS, useAnimatedReaction,
  useSharedValue
} from "react-native-reanimated";
import {ServiceCard, Services, ServicesGradients} from "@/entities/service";
import {useFocusEffect, useRouter} from "expo-router";
import Carousel from "react-native-reanimated-carousel";
import {Dimensions} from "react-native";
import {BlurView} from "expo-blur";
import {Box} from "@/shared/ui";
import {LinearGradient} from "expo-linear-gradient";
import {useTagsStore} from "@/widgets/tags-list";

const window = Dimensions.get("window");

export const ServicesPage = () => {
  const router = useRouter();

  const swipeProgress = useSharedValue(0);

  const gradientStartColors = Object.values(ServicesGradients).map(g => g[0]);
  const gradientEndColors = Object.values(ServicesGradients).map(g => g[1]);

  const { clearTags } = useTagsStore();

  const [colors, setColors] = useState<[string, string]>([
    gradientStartColors[0],
    gradientEndColors[0],
  ]);

  useFocusEffect(
    useCallback(() => {
      clearTags();
    }, [])
  )

  useAnimatedReaction(
    () => {
      const color1 = interpolateColor(
        swipeProgress.value,
        [0, 1, 2, 3, 4],
        [...gradientStartColors, gradientStartColors[0]],
        "RGB"
      );
      const color2 = interpolateColor(
        swipeProgress.value,
        [0, 1, 2, 3, 4],
        [...gradientEndColors, gradientEndColors[0]],
        "RGB"
      );
      return [color1, color2];
    },
    (result) => {
      runOnJS(setColors)([result[0], result[1]]);
    },
    [swipeProgress]
  );

  return (
    <Box backgroundColor={"white"} style={[{ flex: 1, alignItems: "center", justifyContent: "center" }]}>
      <BlurView
        intensity={100}
        style={{ width: "100%", height: "100%", alignItems: "center", justifyContent: "center" }}
      >
        <Carousel
          data={Services}
          loop={true}
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
          onProgressChange={(_offsetProgress, absoluteProgress) => swipeProgress.value = absoluteProgress}
          renderItem={({item}) => <ServiceCard service={item} onPress={() => {
            router.replace({
              pathname: '/tags/[service]',
              params: { service: item.id }
            })
          }}/>}
        />
      </BlurView>

      <LinearGradient
        colors={colors}
        start={{ x: 0, y: 1 }}
        end={{ x: 1, y: 1 }}
        style={{
          position: "absolute", zIndex: -1, opacity: 0.6,
          top: -(window.height * 0.05),
          width: window.height * 0.1,
          height: window.height * 0.1,
          borderRadius: window.height * 0.1 / 2,
          transform: [{ scaleX: window.width / (window.height * 0.1) }],
        }}
      />

      <LinearGradient
        colors={colors}
        start={{ x: 0, y: 1 }}
        end={{ x: 1, y: 1 }}
        style={          {
          position: "absolute", zIndex: -1, opacity: 0.6,
          bottom: -(window.height * 0.025),
          width: window.height * 0.05,
          height: window.height * 0.05,
          borderRadius: window.height * 0.05 / 2,
          transform: [{ scaleX: window.width / (window.height * 0.05) }],
        }}
      />
    </Box>
  )
}

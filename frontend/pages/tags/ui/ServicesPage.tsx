import React from "react";
import Animated, {
  interpolateColor, useAnimatedStyle,
  useSharedValue, withTiming
} from "react-native-reanimated";
import Swiper from "react-native-deck-swiper";
import {ServiceCard, Services, ServicesColors} from "@/entities/service";
import {LinearGradient} from "expo-linear-gradient";
import {useRouter} from "expo-router";

export const ServicesPage = () => {
  const router = useRouter();

  const cardIndex = useSharedValue(0);
  const swipeProgress = useSharedValue(0);

  const animatedBackgroundStyle = useAnimatedStyle(() => {
    const currentIndex = Math.floor(cardIndex.value);
    const nextIndex = (currentIndex + 1) % Object.keys(ServicesColors).length;

    const backgroundColor = interpolateColor(
      swipeProgress.value,
      [0, 1],
      [Object.values(ServicesColors)[currentIndex], Object.values(ServicesColors)[nextIndex]],
      'RGB', { gamma: 2 }
    );

    return { backgroundColor };
  });

  return (
    <Animated.View
      style={[{ flex: 1 }, animatedBackgroundStyle]}
    >
      <Swiper
        cards={Services}
        renderCard={(service) => <ServiceCard service={service}/>}
        infinite
        stackSize={4}
        containerStyle={{ backgroundColor: "transparent", paddingTop: 30 }}
        cardHorizontalMargin={30}
        cardVerticalMargin={100}
        stackSeparation={-20}
        onTapCard={(index) => {
          if (Services[index].id != "organizers" && Services[index].id != "trips") {
            router.push({
              pathname: '/tags/[service]',
              params: { service: Services[index].id }
            })
          }
        }}
        onSwiping={(x, y) => {
          swipeProgress.value = Math.min(Math.max(Math.abs(x), Math.abs(y)) / 100, 1);
        }}
        onSwiped={(index) => {
          swipeProgress.value = withTiming(1, { duration: 150 }, () => {
            cardIndex.value = (index + 1) % Object.keys(ServicesColors).length;
            swipeProgress.value = 0;
          });
        }}
        onSwipedAborted={() => {
          swipeProgress.value = withTiming(0, {duration: 200});
        }}
      />

      <LinearGradient
        colors={["#FFFFFF", "transparent"]} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }}
        style={{
          position: "absolute", width: "100%", height: "100%", zIndex: -1
        }}
      />
    </Animated.View>
  )
}

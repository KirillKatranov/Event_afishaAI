import React from "react";
import {GestureResponderEvent, Pressable} from "react-native";
import {Box} from "@/shared/ui";
import {Text} from "@/shared/ui";
import {Tag} from "@/entities/tag";
import Animated, {
  SharedValue,
  useAnimatedStyle,
  interpolate, withTiming, withSequence, useSharedValue, withSpring
} from "react-native-reanimated";
import Icon from "@/shared/ui/Icons/Icon";
import DropShadow from "react-native-drop-shadow";
import {LinearGradient} from "expo-linear-gradient";
import {ServicesGradients} from "@/entities/service";

interface TagCardProps {
  index: number;
  service: "events" | "places" | "organizers" | "trips";
  tag: Tag;
  liked: boolean;
  onPress: (event: GestureResponderEvent) => void; onLike: () => void;
  scrollY: SharedValue<number>;
}

export const TagCard: React.FC<TagCardProps> = ({
  index,
  service,
  tag,
  liked,
  onPress, onLike,
  scrollY
}) => {
  const scale = useSharedValue(1);
  const rotate = useSharedValue(0);
  const translateX = useSharedValue(0);

  const opacity = useAnimatedStyle(() => ({
    opacity: interpolate(
      scrollY.value,
      [ (index - 1) * 124 + 260, index * 124 + 260 ],
      [1, 0],
      "clamp"
    ),
    transform: [
      {
        scale: interpolate(
          scrollY.value,
          [ (index - 1) * 124 + 260, index * 124 + 260 ],
          [1, 0.8],
          "clamp"
        ),
      },
      {
        translateY: interpolate(
          scrollY.value,
          [ (index - 1) * 124 + 260, index * 124 + 260 ],
          [0, 30],
          "clamp"
        ),
      },
    ],
  }));

  const handleLike = () => {
    if (liked) {
      translateX.value = withSequence(
        withTiming(-5, { duration: 50 }),
        withTiming(5, { duration: 50 }),
        withTiming(-5, { duration: 50 }),
        withTiming(5, { duration: 50 }),
        withTiming(0, { duration: 50 })
      );

      rotate.value = withSequence(
        withTiming(-10, { duration: 100 }),
        withTiming(10, { duration: 100 }),
        withTiming(-10, { duration: 100 }),
        withTiming(10, { duration: 100 }),
        withTiming(0, { duration: 100 }, () => onLike()),
      );
    } else {
      scale.value = withSequence(
        withTiming(1.4, { duration: 150 }),
        withSpring(1, { damping: 5, stiffness: 100 }, () => onLike())
      );
    }
  };

  const likeAnimationStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: scale.value },
      { rotate: `${rotate.value}deg` },
      { translateX: translateX.value },
    ],
  }));

  return (
    <Animated.View
      style={opacity}
    >
      <Pressable onPress={ onPress }>
        <DropShadow
          style={{
            shadowOffset: {width: 0, height: -2},
            shadowColor: "rgba(0,0,0,0.15)",
            shadowRadius: 8, borderRadius: 40, height: "auto", marginBottom: -62,
          }}
        >
          <LinearGradient
            colors={[ServicesGradients[service][0], ServicesGradients[service][1]]}
            style={{
              minHeight: 186, borderRadius: 40, overflow: "hidden",
              padding: 20,
              position: "relative"
            }}
          >
            <Box zIndex={1} flexDirection={"column"} gap={"xs"}>
              {/* Tag description */}
              <Text
                variant={"tagCardDescription"}
                color={service == "places" ? "white" : "black"}
                textTransform={"lowercase"} numberOfLines={1}
                style={{
                  alignSelf: "flex-start", justifyContent: "center",
                  maxWidth: "100%",
                  paddingHorizontal: 6, borderRadius: 10,
                  backgroundColor: service == "places" ? "#A533FF" : "#E1F44B"
                }}
                selectable={false}
              >
                { tag.description }
              </Text>

              {/* Tag name */}
              <Box
                flexDirection={"row"}
                justifyContent={"space-between"}
                alignItems={"center"}
                gap={"xs"}
              >
                <Text
                  variant={"tagCardName"}
                  color={"black"}
                  textTransform={"uppercase"} numberOfLines={1}
                  selectable={false}
                  style={{
                    alignSelf: "flex-start", justifyContent: "center",
                    maxWidth: "100%",
                    paddingHorizontal: 8, borderRadius: 10,
                    backgroundColor: "white"
                  }}
                >
                  { tag.name }
                </Text>

                <Pressable onPress={handleLike}>
                  <Animated.View style={likeAnimationStyle}>
                    <Icon
                      name={ liked ? "likeFilled" : "like" }
                      color={ service == "places" ? "#A533FF" : "#E1F44B" }
                      size={26}
                    />
                  </Animated.View>
                </Pressable>
              </Box>

              {/* Events count chip */}
              {tag.count === 0 && (
                <Text
                  variant={"tagCardEventsCount"}
                  color={service == "places" ? "white" : "black"}
                  textTransform={"lowercase"} numberOfLines={1}
                  style={{
                    alignSelf: "flex-start", justifyContent: "center",
                    maxWidth: "100%",
                    paddingHorizontal: 6, borderRadius: 10,
                    backgroundColor: service == "places" ? "#A533FF" : "#E1F44B"
                  }}
                  selectable={false} opacity={0.9}
                >
                  { "Всё просмотрено" }
                </Text>
              )}

              {tag.count !== 0 && (
                <Text
                  variant={"tagCardEventsCount"}
                  style={{ color: service == "places" ? "#A533FF" : "#FFFFFF"}}
                  selectable={false}
                >
                  { tag.count }
                </Text>
              )}
            </Box>
          </LinearGradient>
        </DropShadow>
      </Pressable>
    </Animated.View>
  )
}

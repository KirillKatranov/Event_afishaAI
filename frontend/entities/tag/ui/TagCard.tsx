import React from "react";
import {Pressable} from "react-native";
import {Box} from "@/shared/ui";
import {Text} from "@/shared/ui";
import {Tag} from "@/entities/tag";
import {colors} from "@/entities/tag";
import Animated, {
  SharedValue,
  useAnimatedStyle,
  interpolate, withTiming, withSequence, useSharedValue, withSpring
} from "react-native-reanimated";
import Icon from "@/shared/ui/Icons/Icon";
import DropShadow from "react-native-drop-shadow";
import {LinearGradient} from "expo-linear-gradient";

interface TagCardProps {
  index: number;
  service: "events" | "places" | "organizers" | "trips";
  tag: Tag;
  liked: boolean;
  onPress: () => void; onLike: () => void;
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
      [ (index - 1) * 124 + 300, index * 124 + 300 ],
      [1, 0],
      "clamp"
    ),
    transform: [
      {
        scale: interpolate(
          scrollY.value,
          [ (index - 1) * 124 + 300, index * 124 + 300 ],
          [1, 0.8],
          "clamp"
        ),
      },
      {
        translateY: interpolate(
          scrollY.value,
          [ (index - 1) * 124 + 300, index * 124 + 300 ],
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
          <Box
            minHeight={186}
            borderRadius={"xl"}
            overflow={"hidden"}
            flexDirection={"column"}
            gap={"xs"}
            style={{
              padding: 20,
              backgroundColor: colors[service],
            }}
          >
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
            <Text
              variant={"tagCardEventsCount"}
              style={{ color: service == "places" ? "#A533FF" : "#FFFFFF"}}
              selectable={false}
            >
              { tag.count }
            </Text>

            <LinearGradient
              colors={[
                'rgba(255,253,253,0.4)', 'rgba(255,253,253,0.45)', 'rgba(255,253,253,0.51)', 'rgba(255,253,253,0.6)',
                'rgba(255,253,253,0.7)', 'rgba(255,253,253,0.8)', 'rgba(255,253,253,0.85)', 'rgba(255,253,253,0.9)'
              ]}
              locations={[0, 0.31, 0.49, 0.62, 0.73, 0.84, 0.92, 1]}
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 1 }}
              style={{
                position: "absolute",
                width: "100%", height: "100%",
                top: 0, left: 0, right: 0, bottom: 0,
                zIndex: -1
              }}
            />
          </Box>
        </DropShadow>
      </Pressable>
    </Animated.View>
  )
}

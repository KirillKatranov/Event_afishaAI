import React from "react";
import {GestureResponderEvent, Pressable} from "react-native";
import {Box} from "@/shared/ui";
import {Text} from "@/shared/ui";
import Animated, {
  interpolate,
  SharedValue,
  useAnimatedStyle,
} from "react-native-reanimated";
import DropShadow from "react-native-drop-shadow";
import {LinearGradient} from "expo-linear-gradient";
import {ServicesGradients} from "@/entities/service";
import {Organizer} from "@/entities/organizers";

interface TagCardProps {
  index: number;
  organizer: Organizer;
  onPress: (event: GestureResponderEvent) => void;
  scrollY: SharedValue<number>;
}

export const OrganizerCard: React.FC<TagCardProps> = ({
  index,
  organizer,
  onPress,
  scrollY
}) => {
  const offset = 300;
  const visibleHeight = 124;
  const opacity = useAnimatedStyle(() => ({
    opacity: interpolate(
      scrollY.value,
      [ (index - 1) * visibleHeight + offset, index * visibleHeight + offset ],
      [1, 0],
      "clamp"
    ),
    transform: [
      {
        translateY: interpolate(
          scrollY.value,
          [ (index - 1) * visibleHeight + offset, index * visibleHeight + offset ],
          [0, 30],
          "clamp"
        ),
      },
      {
        scale: interpolate(
          scrollY.value,
          [ (index - 1) * visibleHeight + offset, index * visibleHeight + offset ],
          [1, 0.8],
          "clamp"
        ),
      },
    ],
  }));

  return (
    <Animated.View style={opacity}>
      <Pressable onPress={ onPress }>
        <DropShadow
          style={{
            shadowOffset: {width: 0, height: -2},
            shadowColor: "rgba(0,0,0,0.15)",
            shadowRadius: 8, borderRadius: 40, height: "auto", marginBottom: -62,
          }}
        >
          <LinearGradient
            colors={[ServicesGradients["organizers"][0], ServicesGradients["organizers"][1]]}
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
                color={"black"}
                textTransform={"lowercase"} numberOfLines={1}
                style={{
                  alignSelf: "flex-start", justifyContent: "center",
                  maxWidth: "100%",
                  paddingHorizontal: 6, borderRadius: 10,
                  backgroundColor: "#E1F44B"
                }}
                selectable={false}
              >
                { organizer.email }
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
                  { organizer.name }
                </Text>
              </Box>
            </Box>
          </LinearGradient>
        </DropShadow>
      </Pressable>
    </Animated.View>
  )
}

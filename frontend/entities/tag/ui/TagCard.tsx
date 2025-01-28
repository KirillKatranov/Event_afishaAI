import React from "react";
import {Pressable} from "react-native";
import {Box} from "@/shared/ui";
import {Text} from "@/shared/ui";
import {Tag} from "@/entities/tag";
import {colors} from "@/entities/tag";
import Animated, {SharedValue, useAnimatedStyle, interpolate} from "react-native-reanimated";
import Icon from "@/shared/ui/Icons/Icon";

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
  const inputRange = [
    (index - 1) * 124 + 300,
    index * 124 + 300,
  ];

  const opacity = useAnimatedStyle(() => ({
    opacity: interpolate(
      scrollY.value,
      inputRange,
      [1, 0],
      "clamp"
    ),
    transform: [
      {
        scale: interpolate(
          scrollY.value,
          inputRange,
          [1, 0.8],
          "clamp"
        ),
      },
      {
        translateY: interpolate(
          scrollY.value,
          inputRange,
          [0, 30],
          "clamp"
        ),
      },
    ],
  }));


  return (
    <Pressable
      onPress={ onPress }
    >
      <Animated.View
        style={[opacity]}
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
            marginBottom: -62,
            shadowOffset: {width: 0, height: -2},
            shadowColor: "rgba(0,0,0,0.15)",
            shadowRadius: 8,
          }}
        >
          {/* Tag description */}
          <Text
            variant={"tagCardDescription"}
            color={service == "places" ? "white" : "black"}
            textTransform={"lowercase"}
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

            <Pressable
              onPress={onLike}
            >
              <Icon
                name={ liked ? "likeFilled" : "like" }
                color={ service == "places" ? "#A533FF" : "#E1F44B" }
                size={32}
              />
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
        </Box>
      </Animated.View>
    </Pressable>
  )
}

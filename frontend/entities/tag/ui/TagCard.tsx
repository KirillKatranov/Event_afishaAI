import React from "react";
import {Pressable} from "react-native";
import {useTheme} from "@shopify/restyle";
import {Box} from "@/shared/ui";
import {Text} from "@/shared/ui";
import {Theme} from "@/shared/providers/Theme";
import {Tag} from "@/entities/tag";
import Icon from "@/shared/ui/Icons/Icon";
import DropShadow from "react-native-drop-shadow";
import Animated, {SharedValue, useAnimatedStyle, interpolate} from "react-native-reanimated";

interface TagCardProps {
  index: number;
  tag: Tag;
  onPress: () => void;
  scrollY: SharedValue<number>;
}

export const TagCard: React.FC<TagCardProps> = ({
  index,
  tag,
  onPress,
  scrollY
}) => {
  const theme = useTheme<Theme>();

  const inputRange = [
    (index - 1) * 124 + 325,
    index * 124 + 325,
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
        style={opacity}
      >
        <DropShadow
          style={{
            borderRadius: 40,
            shadowOffset: {width: 0, height: -2},
            shadowColor: "rgba(0,0,0,0.15)",
            shadowRadius: 8,
          }}
        >
          <Box
            minHeight={186}
            borderRadius={"xl"}
            overflow={"hidden"}
            style={{
              padding: 20,
              backgroundColor: theme.colors.tagsCardColors[index % 4],
              marginBottom: -62
            }}
          >
            <Box
              width="100%"
              flexDirection={"row"}
              gap={"s"}
            >
              <Box
                flex={1}
                flexDirection={"column"}
                gap={"xs"}
              >
                {/* Events count chip */}
                <Box
                  paddingHorizontal={"s"}
                  paddingVertical={"xs"}
                  borderWidth={1}
                  borderColor={"black"}
                  alignSelf={"flex-start"}
                  style={{
                    borderRadius: 20
                  }}
                >
                  <Text
                    variant={"tagCardEventsCount"}
                    color={"black"}
                  >
                    { tag.count }
                  </Text>
                </Box>

                {/* Tag description */}
                <Text
                  variant={"tagCardDescription"}
                  color={"black"}
                  textTransform={"lowercase"}
                >
                  { tag.description }
                </Text>

                {/* Tag name */}
                <Text
                  variant={"tagCardName"}
                  color={"black"}
                  textTransform={"uppercase"}
                  numberOfLines={1}
                  style={{ marginTop: -8 }}
                >
                  { tag.name }
                </Text>
              </Box>

              <Box
                height={"100%"}
                justifyContent={"center"}
              >
                <Icon
                  name={"diagonalArrow"}
                  color={theme.colors.black}
                  size={36}
                />
              </Box>
            </Box>
          </Box>
        </DropShadow>
      </Animated.View>
    </Pressable>
  )
}

import React, {useEffect} from "react";
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
  Easing
} from "react-native-reanimated";
import {StyleProp, ViewStyle} from "react-native";
import {useTheme} from "@shopify/restyle";
import {Theme} from "@/shared/providers/Theme";

interface LoadingCardProps {
  style?: StyleProp<ViewStyle>;
}

export const LoadingCard: React.FC<LoadingCardProps> = ({
  style= {},
}) => {
  const theme = useTheme<Theme>();
  const background = useSharedValue(0);

  useEffect(() => {
    background.value = withRepeat(
      withSequence(withTiming(1, { duration: 700, easing: Easing.inOut(Easing.quad)}), withTiming(0, {duration: 700, easing: Easing.inOut(Easing.quad)})),
      -1
    )
  }, []);

  const animatedBackgroundStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      background.value,
      [0, 1],
      [theme.colors.secondary_bg_color, theme.colors.bg_color],
      'RGB',
      { gamma: 1 }
    ),
  }))

  return (
    <Animated.View
      style={[animatedBackgroundStyle, style]}
    />
  )
}

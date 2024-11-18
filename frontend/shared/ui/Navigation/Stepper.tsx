import React from "react";
import Animated, {useAnimatedStyle, useSharedValue, withTiming} from "react-native-reanimated";
import {useTheme} from "@shopify/restyle";
import {Box} from "@/shared/ui/Base/Box";
import {Theme} from "@/shared/providers/Theme";

interface StepProps {
  isActive: boolean;
}

interface StepperProps {
  pagesCount: number;
  currentPage: number;
}

export const Stepper: React.FC<StepperProps> = ({
  pagesCount,
  currentPage,
}) => {
  return (
    <Box
      justifyContent={"center"}
      flexDirection="row"
      height={8}
      style={{ gap: 1 }}
    >
      {Array.from({ length: pagesCount }).map((_, index) => (
        <Step key={index} isActive={index + 1 === currentPage} />
      ))}
    </Box>
  )
}

const Step: React.FC<StepProps> = ({ isActive }) => {
  const theme = useTheme<Theme>();
  const animatedWidth = useSharedValue(isActive ? 36 : 16);

  animatedWidth.value = withTiming(isActive ? 36 : 16, { duration: 300 });

  const animatedStyle = useAnimatedStyle(() => ({
    width: animatedWidth.value,
    backgroundColor: isActive ? theme.colors.black : theme.colors.transparent,
    opacity: isActive ? 1 : 0.5,
  }));

  return (
    <Animated.View
      style={[
        animatedStyle,
        {
          borderRadius: 10,
          borderWidth: 0.5,
          borderColor: theme.colors.black,
        }
      ]}
    />
  );
};

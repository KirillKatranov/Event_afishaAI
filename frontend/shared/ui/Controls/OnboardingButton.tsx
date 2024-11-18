import React from "react";
import {Pressable} from "react-native";
import {Box} from "@/shared/ui/Base/Box";
import {Text} from "@/shared/ui/Base/Text";

interface OnboardingButtonProps {
  page: number;
  onPress: () => void;
}

export const OnboardingButton: React.FC<OnboardingButtonProps> = ({
  page,
  onPress = () => console.log("Onboarding button pressed"),
}) => {
  return (
    <Pressable
      onPress={onPress}
    >
      <Box
        height={40}
        width={"100%"}
        padding={"s"}
        alignItems={"center"}
        justifyContent={"center"}
        backgroundColor={ page == 1 ? "white" : "lime" }
        borderWidth={1}
        borderColor={"black"}
        style={{
          borderRadius: 10
        }}
      >
        <Text
          variant={"onboardingButton"}
          color={"black"}
        >
          { "Вперед" }
        </Text>
      </Box>
    </Pressable>
  )
}

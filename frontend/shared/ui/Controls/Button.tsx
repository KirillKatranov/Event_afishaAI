import React from "react";
import { Text } from "@/shared/ui";
import { Pressable } from "react-native";
import { THEME_COLORS } from "@/shared/constants"

interface ButtonProps {
  theme: "events" | "places" | "organizers" | "trips";
  variant?: "primary" | "secondary";
  text: string;
  onPress: () => void;
  disabled?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  theme,
  text,
  onPress,
  variant = "primary",
  disabled = false
}) => {
  const colors = THEME_COLORS[theme];

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        {
          width: "100%", height: 40,
          borderRadius: 8,
          padding: 12,
          alignItems: "center", justifyContent: "center",
        },
        variant === "primary"
          ? {
            backgroundColor: disabled ? "#CCCCCC" : (pressed ? colors.pressed : colors.normal),
            borderWidth: 0,
          }
          : {
            backgroundColor: "transparent",
            borderWidth: 2, borderColor: disabled ? "#CCCCCC" : (pressed ? colors.pressed : colors.normal),
          },
      ]}
    >
      <Text
        selectable={false}
        style={[
          { fontFamily: "MontserratMedium", fontSize: 16 },
          { color: variant === "primary" ? (disabled ? "#999999" : colors.text) : (disabled ? "#CCCCCC" : "#000000") }
        ]}
      >
        {text}
      </Text>
    </Pressable>
  );
};

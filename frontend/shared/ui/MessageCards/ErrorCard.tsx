import React from "react";
import {Box} from "@/shared/ui/Base/Box";
import {Text} from "@/shared/ui/Base/Text";
import {StyleProp, TextStyle, ViewStyle} from "react-native";

interface ErrorCardProps {
  text?: string;
  style?: StyleProp<ViewStyle>,
  textStyle?: StyleProp<TextStyle>,
}

export const ErrorCard: React.FC<ErrorCardProps> = ({
  text = "😬 Упс... Что-то пошло не так.",
  style,
  textStyle
}) => {
  return (
    <Box
      flex={1}
      backgroundColor="bg_color"
      justifyContent="center"
      alignItems="center"
      style={style}
    >
      <Text
        variant="body"
        color="text_color"
        textAlign="center"
        style={textStyle}
      >
        { text }
      </Text>
    </Box>
  )
}

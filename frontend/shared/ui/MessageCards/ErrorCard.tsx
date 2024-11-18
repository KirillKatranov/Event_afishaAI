import React from "react";
import {Box} from "@/shared/ui/Base/Box";
import {Text} from "@/shared/ui/Base/Text";

export const ErrorCard = () => {
  return (
    <Box
      flex={1}
      backgroundColor="bg_color"
      justifyContent="center"
      alignItems="center"
    >
      <Text
        variant="body"
        color="text_color"
        textAlign="center"
      >
        { "😬 Упс... Что-то пошло не так." }
      </Text>
    </Box>
  )
}

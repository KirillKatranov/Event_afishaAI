import React from "react";
import { Image } from "react-native";
import { Box, Text } from "@/shared/ui";

export const TagsHeader: React.FC = () => {
  return (
    <Box
      style={{
        paddingBottom: 28,
        zIndex: 1,
      }}
    >
      <Image
        source={require("@/shared/assets/images/BlurredCircles.png")}
        resizeMode="stretch"
        style={{
          position: "absolute",
          zIndex: -1,
          width: "100%",
          height: 150,
        }}
      />

      <Box
        paddingTop="eventCardPadding"
        gap="xl"
        style={{ paddingHorizontal: 20 }}
      >
        <Text variant="tagsHeaderQuestion" color="text_color">
          {`Какое мероприятие\nты хотел бы выбрать?`}
        </Text>

        <Text variant="tagsHeader" color="text_color" textAlign="center">
          {"КАТЕГОРИИ"}
        </Text>
      </Box>
    </Box>
  );
};

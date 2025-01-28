import React from "react";
import { Box, Text } from "@/shared/ui";

export const TagsHeader: React.FC = () => {
  return (
    <Box
      style={{
        paddingBottom: 16, paddingTop: 108,
        zIndex: 1,
      }}
    >
      <Text variant="tagsHeader" color={"black"} textAlign="center">
        {"КАТЕГОРИИ"}
      </Text>
    </Box>
  );
};

import React from "react";
import {Box} from "@/shared/ui/Base/Box";
import {Text} from "@/shared/ui/Base/Text";

interface TagChipProps {
  text: string;
}

export const TagChip: React.FC<TagChipProps> = ({
  text
}) => {
  return (
    <Box
      height={40}
      borderRadius={"l"}
      backgroundColor={"cardBGColor"}
      alignItems={"center"}
      justifyContent={"center"}
      style={{ paddingHorizontal: 10 }}
    >
      <Text
        variant={"tagChip"}
        color={"lime"}
        selectable={false}
      >
        {text}
      </Text>
    </Box>
  )
}

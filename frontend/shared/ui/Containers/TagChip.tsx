import React from "react";
import {Box} from "@/shared/ui/Base/Box";
import {Text} from "@/shared/ui/Base/Text";

interface TagChipProps {
  text: string;
  color?: string;
}

export const TagChip: React.FC<TagChipProps> = ({
  text,
  color
}) => {
  return (
    <Box
      height={36}
      borderRadius={"l"}
      backgroundColor={"cardBGColor"}
      alignItems={"center"}
      justifyContent={"center"}
      style={{ paddingHorizontal: 10 }}
    >
      <Text
        variant={"tagChip"}
        selectable={false}
        style={{ color: color }}
      >
        {text}
      </Text>
    </Box>
  )
}

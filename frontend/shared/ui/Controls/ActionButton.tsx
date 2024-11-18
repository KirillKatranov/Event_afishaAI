import React from "react";
import {Box} from "@/shared/ui/Base/Box";
import {Pressable} from "react-native";
import Icon from "@/shared/ui/Icons/Icon";
import {useTheme} from "@shopify/restyle";
import {Theme} from "@/shared/providers/Theme";

interface ActionButtonProps {
  type: "like" | "dislike";
  onPress: () => void;
}

export const ActionButton: React.FC<ActionButtonProps> = ({
  type,
  onPress
}) => {
  const theme = useTheme<Theme>();

  return (
    <Pressable
      onPress={onPress}
      style={{ flex: 1 }}
    >
      <Box
        height={56}
        borderRadius={"s"}
        backgroundColor={ type == "like" ? "red" : "gray" }
        alignItems={"center"}
        justifyContent="center"
      >
        <Icon
          name={ type == "like" ? "likeFilled" : "dislike" }
          color={ type == "like" ? theme.colors.gray : theme.colors.red }
          size={24}
        />
      </Box>
    </Pressable>
  )
}

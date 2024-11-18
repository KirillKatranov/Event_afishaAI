import React from "react";
import {ImageBackground, Pressable} from "react-native";
import {useTheme} from "@shopify/restyle";
import {Box} from "@/shared/ui";
import {Text} from "@/shared/ui";
import {Theme} from "@/shared/providers/Theme";

interface TagCardProps {
  name: string,
  description: string,
  image: string | null,
  onPress: () => void;
}

export const TagCard: React.FC<TagCardProps> = ({
  name,
  description,
  image,
  onPress
}) => {
  const theme = useTheme<Theme>();

  return (
    <Pressable
      style={{
        flex: 1
      }}
      onPress={ onPress }
    >
      <ImageBackground
        source={{ uri: image ? image : undefined }}
        alt={description}
        resizeMode="cover"
        style={{
          minHeight: 150,
          backgroundColor: theme.colors.secondary_bg_color,
          justifyContent: "flex-end",
          alignItems: "center",
          borderRadius: 16,
          overflow: "hidden"
        }}
      >
        <Box
          width="100%"
          backgroundColor="secondary_bg_color"
          alignItems="center"
          justifyContent="center"
          padding="s"
        >
          <Text
            variant="body"
            color="text_color"
          >
            { name + " "}
          </Text>
        </Box>
      </ImageBackground>
    </Pressable>
  )
}

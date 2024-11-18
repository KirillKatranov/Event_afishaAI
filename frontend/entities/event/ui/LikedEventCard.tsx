import React from "react";
import {Pressable, Image} from "react-native";
import {Box} from "@/shared/ui/Base/Box";
import {Text} from "@/shared/ui/Base/Text";
import {formatDate} from "@/shared/scripts/date";

interface LikedEventCardProps {
  image?: string;
  name: string;
  date: string;
  onPress: () => void;
}

export const LikedEventCard: React.FC<LikedEventCardProps> = ({
  image,
  name,
  date,
  onPress,
}) => {
  return (
    <Pressable
      onPress={onPress}
    >
      <Box
        flex={1}
        flexDirection="row"
        backgroundColor="secondary_bg_color"
        minHeight={120}
        overflow="hidden"
        style={{
          borderRadius: 16,
        }}
      >
        <Image
          source={{ uri: image ? image : undefined }}
          resizeMode={"cover"}
          blurRadius={10}
          style={{
            height: "100%",
            width: "40%",
            position: "absolute",
            left: 0
          }}
        />

        <Image
          source={{ uri: image ? image : undefined }}
          resizeMode={"contain"}
          style={{
            height: "100%",
            width: "40%",
          }}
        />

        <Box
          flex={1}
          flexDirection="column"
          justifyContent="center"
          padding="m"
        >
          <Text
            variant="body"
            color="text_color"
          >
            { name }
          </Text>

          <Text
            variant="body"
            color="subtitle_text_color"
          >
            { formatDate(date) }
          </Text>
        </Box>
      </Box>
    </Pressable>
  )
}

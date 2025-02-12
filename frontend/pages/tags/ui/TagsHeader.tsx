import React from "react";
import { Box, Text } from "@/shared/ui";
import {Image, Pressable} from "react-native";
import Icon from "@/shared/ui/Icons/Icon";
import {useRouter} from "expo-router";
import {useTheme} from "@shopify/restyle";
import {Theme} from "@/shared/providers/Theme";

interface TagsHeaderProps {
  title: string;
  service: "events" | "places" | "organizers" | "trips";
}

export const TagsHeader: React.FC<TagsHeaderProps> = (
  props
) => {
  const router = useRouter();
  const theme = useTheme<Theme>();

  const image = props.service == "events" ?
    require("@/shared/assets/images/pink.png") :
    (props.service == "places" ?
      require("@/shared/assets/images/lime.png") :
      (props.service == "organizers" ?
        require("@/shared/assets/images/blue.png") :
        require("@/shared/assets/images/purple.png")))

  return (
    <Box
      style={{
        paddingBottom: 16, paddingTop: 108,
        zIndex: 1,
      }}
    >
      <Image
        source={image}
        resizeMode={"stretch"} blurRadius={30}
        style={{ overflow: "visible", width: "110%", alignSelf: "center", opacity: 0.75, position: "absolute", zIndex: -2, top: -30 }}
      />

      <Pressable
        onPress={() => {
          router.back();
        }}
        style={{ position: "absolute", zIndex: 1, top: 20, left: 20 }}
      >
        <Box
          width={40} height={40}
          borderRadius={"eventCard"}
          alignItems={"center"} justifyContent={"center"}
        >
          <Icon name={"chevronLeft"} color={theme.colors.text_color} size={24}/>
        </Box>
      </Pressable>

      <Text variant="tagsHeader" color={"text_color"} textAlign="center">
        {props.title}
      </Text>
    </Box>
  );
};

import React from "react";
import { Box, Text } from "@/shared/ui";
import {Pressable} from "react-native";
import Icon from "@/shared/ui/Icons/Icon";
import {useRouter} from "expo-router";
import {useTheme} from "@shopify/restyle";
import {Theme} from "@/shared/providers/Theme";
import DropShadow from "react-native-drop-shadow";

interface TagsHeaderProps {
  title: string;
  service: "events" | "places" | "organizers" | "trips";
}

export const TagsHeader: React.FC<TagsHeaderProps> = (
  props
) => {
  const router = useRouter();
  const theme = useTheme<Theme>();

  return (
    <DropShadow
      style={{
        shadowOffset: {width: 2, height: 2},
        shadowColor: "rgba(0,0,0,0.25)",
        shadowRadius: 8,
        paddingBottom: 12, paddingTop: 60, borderBottomStartRadius: 20, borderBottomEndRadius: 20,
      }}
    >
      <Pressable
        onPress={() => {
          router.replace("/tags");
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

      <Text style={{ fontFamily: "UnboundedSemiBold", fontSize: 32, textAlign: "center", color: theme.colors.black }}>
        {props.title.toUpperCase()}
      </Text>
    </DropShadow>
  );
};

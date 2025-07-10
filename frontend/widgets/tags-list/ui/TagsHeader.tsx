import React from "react";
import { Box, Text } from "@/shared/ui";
import {Pressable, View} from "react-native";
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

  return (
    <View style={{ paddingBottom: 12, paddingTop: 98 }} >
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

      <Text style={{ fontFamily: "TDMars", fontWeight: "500", fontSize: 22, textAlign: "center", color: theme.colors.black }}>
        {props.title.toUpperCase()}
      </Text>
    </View>
  );
};

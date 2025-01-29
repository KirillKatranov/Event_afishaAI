import React from "react";
import { Box, Text } from "@/shared/ui";
import {Pressable} from "react-native";
import Icon from "@/shared/ui/Icons/Icon";
import {useRouter} from "expo-router";

export const TagsHeader: React.FC = () => {
  const router = useRouter();

  return (
    <Box
      style={{
        paddingBottom: 16, paddingTop: 108,
        zIndex: 1,
      }}
    >
      <Pressable
        onPress={() => {
          router.back();
        }}
        style={{ position: "absolute", zIndex: 1, top: 16, left: 16 }}
      >
        <Box
          backgroundColor={"cardBGColor"}
          width={40} height={40}
          borderRadius={"eventCard"}
          alignItems={"center"} justifyContent={"center"}
        >
          <Icon name={"chevronLeft"} color={"#ECEBE8"} size={24}/>
        </Box>
      </Pressable>

      <Text variant="tagsHeader" color={"black"} textAlign="center">
        {"КАТЕГОРИИ"}
      </Text>
    </Box>
  );
};

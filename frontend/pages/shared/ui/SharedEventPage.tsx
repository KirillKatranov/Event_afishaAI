import React from "react";
import {Box, Text} from "@/shared/ui";
import {SharedEventCard} from "@/widgets/shared-event";
import {Pressable} from "react-native";
import {useRouter} from "expo-router";
import {useSafeAreaInsets} from "@/shared/providers/SafeAreaWrapper";

export const SharedEventPage: React.FC = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <Box
      flex={1}
      backgroundColor={"bg_color"}
      style={{ paddingTop: insets.top, paddingBottom: insets.bottom }}
    >
      <SharedEventCard/>

      <Pressable
        onPress={() => router.replace("/feed")}
      >
        <Box
          width={"100%"} height={48}
          backgroundColor={"lime"}
          justifyContent={"center"} alignItems={"center"}
        >
          <Text
            variant={"sharedCardButton"}
            color={"black"}
            textAlign={"center"}
          >
            { "Листать ленту" }
          </Text>
        </Box>
      </Pressable>
    </Box>
  )
}

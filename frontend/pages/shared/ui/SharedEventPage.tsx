import React from "react";
import {Box, Text} from "@/shared/ui";
import {SharedEventCard} from "@/widgets/shared-event";
import {Pressable} from "react-native";
import {useLocalSearchParams, useRouter} from "expo-router";

export const SharedEventPage: React.FC = () => {
  const { firstLaunch } = useLocalSearchParams<{ firstLaunch: string }>();
  const router = useRouter();

  return (
    <Box
      flex={1}
    >
      <SharedEventCard/>

      <Pressable
        onPress={() => router.replace(firstLaunch == "true" ? "/onboarding" : "/feed")}
      >
        <Box
          width={"100%"} height={40}
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

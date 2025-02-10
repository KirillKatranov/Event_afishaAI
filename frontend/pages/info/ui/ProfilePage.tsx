import React, {useCallback} from "react";
import {Image, Pressable} from "react-native";
import {useFocusEffect, useRouter} from "expo-router";
import {useOnboardingStore} from "@/widgets/onboarding-elements";
import {Box, Text} from "@/shared/ui";
import {useConfig} from "@/shared/providers/TelegramConfig";

export const ProfilePage = () => {
  const router = useRouter();
  const { initDataUnsafe } = useConfig();

  useFocusEffect(
    useCallback(() => {
      useOnboardingStore.setState(() => ({ page: 1 }));
    }, [])
  )

  return (
    <Box
      flex={1}
      backgroundColor={"bg_color"}
      padding={"m"}
      gap={"m"}
    >
      <Box
        flex={1}
        gap={"m"}
        alignItems={"center"}
      >
        <Image
          source={{ uri: initDataUnsafe.user.photo_url }}
          style={{
            width: 250,
            height: 250,
            borderRadius: 500
          }}
        />

        <Text
          variant={"cardHeader"}
          color={"text_color"}
          textAlign={"center"}
        >
          { initDataUnsafe.user.first_name }
        </Text>
      </Box>

      <Pressable
        onPress={ () => { router.replace("/onboarding") }}
      >
        <Box
          backgroundColor="button_color"
          height={52}
          width={"100%"}
          alignItems="center"
          justifyContent="center"
          style={{
            borderRadius: 12,
          }}
        >
          <Text
            variant="body"
            color="button_text_color"
          >
            { "О нас" }
          </Text>
        </Box>
      </Pressable>

      <Pressable
        onPress={ () => { router.push("/profile/feedback") }}
      >
        <Box
          backgroundColor="button_color"
          height={52}
          width={"100%"}
          alignItems="center"
          justifyContent="center"
          style={{
            borderRadius: 12,
          }}
        >
          <Text
            variant="body"
            color="button_text_color"
          >
            { "Форма обратной связи"}
          </Text>
        </Box>
      </Pressable>
      <Pressable
        onPress={ () => { router.back() }}
      >
        <Box
          backgroundColor="button_color"
          height={52}
          width={"100%"}
          alignItems="center"
          justifyContent="center"
          style={{
            borderRadius: 12,
          }}
        >
          <Text
            variant="body"
            color="button_text_color"
          >
            { "Назад" }
          </Text>
        </Box>
      </Pressable>
    </Box>
  );
}

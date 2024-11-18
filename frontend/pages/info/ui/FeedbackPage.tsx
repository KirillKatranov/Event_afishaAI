import React from "react";
import {Pressable, TextInput} from "react-native";
import {useRouter} from "expo-router";
import {useTheme} from "@shopify/restyle";
import Ionicons from "@expo/vector-icons/Ionicons";
import {useFeedbackStore} from "@/pages/info/model/store/useFeedbackState";
import {Theme} from "@/shared/providers/Theme";
import {useConfig} from "@/shared/providers/TelegramConfig";
import {Text} from "@/shared/ui";
import {Box} from "@/shared/ui";

export const FeedbackPage = () => {
  const theme = useTheme<Theme>();
  const router = useRouter();
  const config = useConfig();
  const { text, setText, submitFeedback, hasError, isSuccess } = useFeedbackStore();

  return (
    <Box
      flex={1}
      gap="l"
      backgroundColor="bg_color"
      style={{
        padding: 32
      }}
    >
      <Box
        width="100%"
        flexDirection="row"
        gap="m"
        alignItems="center"
      >
        <Pressable
          onPress={ () => router.back() }
        >
          <Ionicons name={"arrow-back"} size={24} color={theme.colors.text_color}/>
        </Pressable>

        <Text
          variant="header"
          color="text_color"
          textAlign="center"
        >
          { "Обратная связь" }
        </Text>
      </Box>

      <TextInput
        value={text}
        onChangeText={setText}
        placeholder={ "Можешь написать здесь всё, что угодно" }
        placeholderTextColor={theme.colors.hint_color}
        textAlignVertical="bottom"
        multiline={true}
        selectionColor={theme.colors.button_color}
        style={{
          flex: 1,
          height: "100%",
          color: theme.colors.text_color,
          fontFamily: "MontserratRegular",
          textAlignVertical: "top"
        }}
      />

      {
        hasError && (
          <Text
            variant="body"
            color="text_color"
            textAlign="center"
          >
            { "😬 Упс... Что-то пошло не так." }
          </Text>
        )
      }

      {
        isSuccess && (
          <Text
            variant="body"
            color="text_color"
            textAlign="center"
          >
            { "✅ Ваш ответ записан. Спасибо!" }
          </Text>
        )
      }

      <Pressable
        onPress={ () => submitFeedback(config.initDataUnsafe.user.username) }
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
            { "Отправить" }
          </Text>
        </Box>
      </Pressable>
    </Box>
  );
}

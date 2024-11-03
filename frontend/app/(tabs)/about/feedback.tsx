import {Pressable, TextInput} from 'react-native';
import Box from "@/components/Box";
import Text from "@/components/Text";
import {useFeedbackStore} from "@/stores/useFeedbackState";
import Ionicons from "@expo/vector-icons/Ionicons";
import {useRouter} from "expo-router";
import {useTheme} from "@shopify/restyle";
import {Theme} from "@/shared/providers/Theme";
import {useConfig} from "@/shared/providers/TelegramConfig";

export default function FeedbackScreen() {
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
          fontFamily: "InterRegular",
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

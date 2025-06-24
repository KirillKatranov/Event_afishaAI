import React, {useCallback} from "react";
import {Pressable} from "react-native";
import {Calendar} from "react-native-calendars";
import {Box} from "@/shared/ui/Base/Box";
import {Text} from "@/shared/ui/Base/Text";
import {useCalendarStore} from "@/widgets/Date";
import {useTheme} from "@shopify/restyle";
import {Theme} from "@/shared/providers/Theme";
import {useFocusEffect} from "expo-router";
import {useConfig} from "@/shared/providers/TelegramConfig";

export const DatePicker: React.FC = () => {
  const theme = useTheme<Theme>()
  const minDate = new Date();
  const username = useConfig().initDataUnsafe.user.username;

  const {
    displayDays,
    updateSelectedDays,
    clearSelectedDays,
    fetchAllLikes
  } = useCalendarStore();

  useFocusEffect(
    useCallback(() => {
      fetchAllLikes(username);
    }, [fetchAllLikes])
  )

  return (
    <Box
      overflow={"hidden"}
      style={{
        borderRadius: 8
      }}
    >
      <Calendar
        minDate={minDate.toString()}
        markingType={"period"}
        markedDates={displayDays}
        onDayPress={updateSelectedDays}
        style={{
          backgroundColor: theme.colors.secondary_bg_color,
        }}
        theme={{
          calendarBackground: theme.colors.secondary_bg_color,
          dayTextColor: theme.colors.text_color,
          textDisabledColor: theme.colors.subtitle_text_color,
          monthTextColor: theme.colors.text_color
        }}
      />

      <Box
        flexDirection="row"
        width={"100%"}
        alignItems={"center"}
        justifyContent={"center"}
        paddingHorizontal="xl"
        backgroundColor={"secondary_bg_color"}
      >
        <Pressable
          onPress={ clearSelectedDays }
        >
          <Box
            width={"100%"}
            height={40}
            alignItems={"center"}
            justifyContent={"center"}
            padding="s"
          >
            <Text
              variant="body"
              color={"text_color"}
              textAlign={"center"}
            >
              { "Сбросить" }
            </Text>
          </Box>
        </Pressable>
      </Box>
    </Box>
  )
}

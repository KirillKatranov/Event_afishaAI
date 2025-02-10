import React, {useCallback} from "react";
import {Image, Pressable} from "react-native";
import { useFocusEffect, useRouter } from "expo-router";
import { useTheme } from "@shopify/restyle";
import {CalendarList, LocaleConfig} from "react-native-calendars";
import { useCalendarStore } from "@/features/dates";
import { Box } from "@/shared/ui/Base/Box";
import { Text } from "@/shared/ui/Base/Text";
import { Theme } from "@/shared/providers/Theme";
import { useConfig } from "@/shared/providers/TelegramConfig";
import {CalendarHeader} from "./calendar-components/CalendarHeader";
import {CalendarDay} from "@/widgets/date-picker/ui/calendar-components/CalendarDay";
import Animated, {useAnimatedStyle, useSharedValue, withDelay, withSequence, withTiming} from "react-native-reanimated";
import {LinearGradient} from "expo-linear-gradient";

export const DatePicker: React.FC = () => {
  const theme = useTheme<Theme>();
  const minDate = new Date();
  const username = useConfig().initDataUnsafe.user.username;
  const [filterMessage, setFilterMessage] = React.useState<string>("");
  const { initDataUnsafe } = useConfig();
  const router = useRouter()

  const {
    displayDays, selectedDaysUpdated, tempSelectedDays,
    submitSelectedDays, updateSelectedDays, clearSelectedDays,
    fetchAllLikes
  } = useCalendarStore();

  useFocusEffect(
    useCallback(() => {
      fetchAllLikes(username);
    }, [fetchAllLikes])
  );

  const onSubmitPress = () => {
    submitSelectedDays();
    opacityAnimation.value = withSequence(
      withTiming(1, { duration: 300 }),
      withDelay(1500, withTiming(0, { duration: 300 }))
    );
    setFilterMessage("✅  Фильтр успешно применён");
  }

  const onCancelPress = () => {
    clearSelectedDays();
    opacityAnimation.value = withSequence(
      withTiming(1, { duration: 300 }),
      withDelay(1500, withTiming(0, { duration: 300 }))
    );
    setFilterMessage("🗑  Фильтр отменён");
  }

  const opacityAnimation = useSharedValue(0);

  const animatedMessageView = useAnimatedStyle(() => ({
    opacity: opacityAnimation.value
  }))

  const monthNames = [
      "Январь", "Февраль",
      "Март", "Апрель", "Май",
      "Июнь", "Июль", "Август",
      "Сентябрь", "Октябрь", "Ноябрь",
      "Декабрь",
    ];

  LocaleConfig.locales['ru'] = {
    monthNames: monthNames,
    monthNamesShort: [
      "Янв", "Фев", "Мар", "Апр", "Май", "Июн", "Июл", "Авг", "Сен", "Окт", "Ноя", "Дек"
    ],
    dayNames: [
      "Воскресенье", "Понедельник", "Вторник", "Среда", "Четверг", "Пятница", "Суббота",
    ],
    dayNamesShort: ["ВС", "ПН", "ВТ", "СР", "ЧТ", "ПТ", "СБ"],
    today: "Сегодня",
  };
  LocaleConfig.defaultLocale = 'ru';

  return (
    <Box
      flex={1}
      gap={"m"}
      paddingBottom={"m"}
    >
      <Image
        source={require("@/shared/assets/images/CalendarGradient.png")}
        resizeMode="stretch"
        style={{
          position: "absolute",
          zIndex: 2,
          width: "130%",
          height: 120,
          top: -65,
          alignSelf: "center"
        }}
      />

      <LinearGradient
        colors={[theme.colors.bg_color, theme.colors.transparent]}
        style={{
          position: "absolute",
          width: "100%",
          height: 60,
          zIndex: 1
        }}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
      />

      
      <CalendarList
        pastScrollRange={0}
        futureScrollRange={1}
        current={minDate.toISOString().split("T")[0]}
        minDate={minDate.toISOString().split("T")[0]}
        markingType={"period"}
        markedDates={displayDays}
        onDayPress={updateSelectedDays}
        calendarHeight={244}
        contentContainerStyle={{
          gap: 40,
          flexGrow: 1,
          marginTop: 50,
          marginBottom: 30,
          justifyContent: "center"
        }}
        showsVerticalScrollIndicator={false}
        hideDayNames={true}
        theme={{
          calendarBackground: theme.colors.transparent,
          weekVerticalMargin: 2,
          contentStyle: { width: "100%"},
        }}

        style={{ flex: 1, zIndex: -1 }}

        calendarStyle={{
          flex: 1,
          paddingHorizontal: 40,
          width: "100%",
        }}

        dayComponent={(day) => {
          return <CalendarDay day={day} onPress={() => updateSelectedDays(day.date!)}/>
        }}

        customHeader={(date: { month: any; }) => {
          return (<CalendarHeader month={monthNames[date.month.getMonth()]}/>)
        }}

        firstDay={1}
        monthFormat={"MMMM"}
      />

      {/* Buttons Section */}
      <Box
        flexDirection={"column"}
        width={"100%"}
        alignItems={"center"}
        justifyContent={"center"}
        gap={"s"}
        paddingHorizontal={"l"}
      >
        <Pressable
          onPress={onCancelPress}
          disabled={ Object.keys(tempSelectedDays).length == 0 }
        >
          <Box
            width={254} height={30}
            alignItems={"center"} justifyContent={"center"}
            padding={"s"}
            borderRadius={"l"}
            backgroundColor={
              Object.keys(tempSelectedDays).length == 0 ?
                "transparent" :
                "secondary_bg_color"
            }
          >
            <Text
              variant={"calendarAcceptButton"}
              color={"text_color"}
              textAlign={"center"}
              selectable={false}
            >
              {"Сброс"}
            </Text>
          </Box>
        </Pressable>

        <Pressable
          onPress={onSubmitPress}
          disabled={!selectedDaysUpdated}
        >
          <Box
            width={254} height={32}
            alignItems={"center"} justifyContent={"center"}
            padding={"s"}
            borderRadius={"l"}
            backgroundColor={!selectedDaysUpdated ? "calendarAcceptButtonDisabled" : "calendarAcceptButton"}
          >
            <Text
              variant={"calendarAcceptButton"}
              color={"black"}
              textAlign={"center"}
              selectable={false}
            >
              {"Выбрать Период"}
            </Text>
          </Box>
        </Pressable>
      </Box>

      <Animated.View
        style={[
          animatedMessageView,
          {
            position: "absolute",
            alignSelf: "center",
            top: 20,
            paddingHorizontal: 12, paddingVertical: 8,
            borderRadius: 8,
            backgroundColor: theme.colors.secondary_bg_color,
            zIndex: 2
          }
        ]}
      >
        <Text
          variant={"tagChip"}
          color={"text_color"}
          textAlign={"center"}
          selectable={false}
        >
          { filterMessage }
        </Text>
      </Animated.View>
    </Box>
  );
};

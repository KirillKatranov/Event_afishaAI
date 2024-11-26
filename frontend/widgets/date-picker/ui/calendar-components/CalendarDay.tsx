import React from "react";
import {Box, Text} from "@/shared/ui";
import {DateData} from "react-native-calendars";
import {Pressable} from "react-native";
import {DayProps} from "react-native-calendars/src/calendar/day";
import {formatDay} from "@/shared/scripts/date";

interface CalendarDayProps {
  day: DayProps & { date?: DateData | undefined };
  onPress: () => void;
}

export const CalendarDay: React.FC<CalendarDayProps> = ({
  day,
  onPress
}) => {
  return (
    <Pressable
      disabled={day.state == "disabled"}
      onPress={onPress}
      style={{ width: "100%" }}
    >
      <Box
        width={"100%"}
        height={30}
        alignItems={"center"} justifyContent={"center"}
        backgroundColor={
          day.marking && day.marking.selected ?
            ((day.marking.startingDay || day.marking.endingDay) ? "calendarStartingEndingDay" : "calendarSelectedDay") :
            (day.state == "today" ? "secondary_bg_color" : "bg_color")
        }
        borderTopLeftRadius={
          day.marking && day.marking.selected ?
            (day.marking.startingDay ? "calendarDay" : undefined) :
            day.state == "today" ? "calendarDay" : undefined
        }
        borderBottomLeftRadius={
          day.marking && day.marking.selected ?
            (day.marking.startingDay ? "calendarDay" : undefined) :
            day.state == "today" ? "calendarDay" : undefined
        }
        borderTopRightRadius={
          day.marking && day.marking.selected ?
            (day.marking.endingDay ? "calendarDay" : undefined) :
            day.state == "today" ? "calendarDay" : undefined
        }
        borderBottomRightRadius={
          day.marking && day.marking.selected ?
            (day.marking.endingDay ? "calendarDay" : undefined) :
            day.state == "today" ? "calendarDay" : undefined
        }
      >
        <Text
          variant={"calendarDay"}
          color={
            day.marking && (day.marking.startingDay || day.marking.endingDay) ?
              "white" :
              (day.marking && (day.marking.selected)) ?
                "black" :
                (day.state == "disabled") ? "subtitle_text_color" : "text_color"
          }
          selectable={false}
          textAlign={"center"} textAlignVertical={"center"}
        >
          { formatDay(day.date!.day.toString()) }
        </Text>
      </Box>

      {
        day.marking && day.marking.marked == true && (
          <Box
            width={4} height={4} position={"absolute"} borderRadius={"s"}
            alignSelf={"center"}
            bottom={1} backgroundColor={"lime"}
          />
        )
      }
    </Pressable>
  )
}

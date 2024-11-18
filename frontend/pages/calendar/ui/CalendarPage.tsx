import React from "react";
import {DatePicker} from "@/widgets/date-picker";
import {Box} from "@/shared/ui";

export const CalendarPage: React.FC = () => {
  return (
    <Box
      flex={1}
      backgroundColor={"bg_color"}
      justifyContent={"center"}
      padding={"m"}
    >
      <DatePicker/>
    </Box>
  )
}

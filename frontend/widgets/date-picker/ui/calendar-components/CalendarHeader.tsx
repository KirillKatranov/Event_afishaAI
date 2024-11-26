import React from "react";
import {Box, Text} from "@/shared/ui";

interface CalendarHeaderProps {
  month: string;
}

export const CalendarHeader: React.FC<CalendarHeaderProps> = ({
  month
}) => {
  return (
    <Box
      width={"100%"}
      style={{
        gap: 20,
      }}
    >
      <Text
        variant={"calendarMonth"}
        color={"text_color"}
        textAlign={"center"}
      >
        {month}
      </Text>

      <Box
        flexDirection={"row"}
        marginBottom={"xs"}
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        {["ПН", "ВТ", "СР", "ЧТ", "ПТ", "СБ", "ВС"].map((day) => (
          <Box
            key={day}
            style={{
              height: 30,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flex: 1,
            }}
          >
            <Text
              variant={"calendarHeaderDay"}
              color={day === "СБ" || day === "ВС" ? "red" : "text_color"}
            >
              {day}
            </Text>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

import React from "react";
import {EventsSwiper} from "@/widgets/events-swiper";
import {Box} from "@/shared/ui";

export const FeedPage = () => {
  return (
    <Box
      flex={1}
      flexDirection="column"
    >
      <EventsSwiper/>
    </Box>
  )
}

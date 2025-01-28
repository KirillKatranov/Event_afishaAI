import React, {useEffect} from "react";
import {useLocalSearchParams} from "expo-router";
import {useConfig} from "@/shared/providers/TelegramConfig";
import {EventsSwiper} from "@/widgets/events-swiper";
import {useEventsSwiperStore} from "@/features/content";
import {getPeriodBorders} from "@/shared/scripts/date";
import {ErrorCard, LoadingCard} from "@/shared/ui";
import {useCalendarStore} from "@/features/dates";

export const SwiperPage = () => {
  const { tag } = useLocalSearchParams<{ tag: string }>();
  const username = useConfig().initDataUnsafe.user.username;

  const {
    events,
    isLoading, hasError,
    swipedAll, setSwipedAll,
    fetchEvents,
  } = useEventsSwiperStore();

  const { selectedDays } = useCalendarStore();

  useEffect(() => {
    const borders = getPeriodBorders(Object.keys(selectedDays));
    fetchEvents({
      username: username,
      tag: tag,
      date_start: borders.date_start,
      date_end: borders.date_end
    });
  }, [selectedDays]);

  if (isLoading) return <LoadingCard style={{ flex: 1, height: "100%", width: "100%" }}/>
  if (hasError) return <ErrorCard />

  return <EventsSwiper events={events} swipedAll={swipedAll} setSwipedAll={setSwipedAll}/>;
}

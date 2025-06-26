import React, {useEffect, useState} from "react";
import {useLocalSearchParams} from "expo-router";
import {useConfig} from "@/shared/providers/TelegramConfig";
import {EventsVerticalSwiper} from "@/widgets/events-swiper";
import {useEventsSwiperStore} from "@/features/content";
import {getPeriodBorders} from "@/shared/scripts/date";
import {ErrorCard} from "@/shared/ui";
import {useCalendarStore} from "@/features/dates";
import {useSafeAreaInsets} from "@/shared/providers/SafeAreaWrapper";
import {Dimensions} from "react-native";

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

  const onEvent = useConfig().onEvent;
  const NAV_BAR_HEIGHT = 57;
  const { height } = Dimensions.get('window');
  const { bottom} = useSafeAreaInsets();
  const [swiperHeight, setSwiperHeight] = useState(height - NAV_BAR_HEIGHT - bottom);

  useEffect(() => {
    onEvent("viewportChanged", () => {
      // @ts-ignore
      setSwiperHeight(window.Telegram.WebApp.viewportHeight - NAV_BAR_HEIGHT - bottom);
    })
  }, [setSwiperHeight]);

  useEffect(() => {
    const borders = getPeriodBorders(Object.keys(selectedDays));
    fetchEvents({
      username: username,
      tag: tag,
      date_start: borders.date_start,
      date_end: borders.date_end
    });
  }, [selectedDays]);

  if (hasError) return <ErrorCard />

  return (
    <EventsVerticalSwiper
      events={events}
      swipedAll={swipedAll} setSwipedAll={setSwipedAll}
      containerHeight={swiperHeight}
      isLoading={isLoading}
      tag={tag}
    />
  );
}

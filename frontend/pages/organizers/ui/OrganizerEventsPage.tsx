import React, {useCallback, useEffect, useState} from "react";
import {Dimensions, View} from "react-native";
import {EventsVerticalSwiper} from "@/widgets/events-swiper";
import {useFocusEffect, useLocalSearchParams} from "expo-router";
import {useOrganizerEventsStore} from "@/features/organizer-content";
import {LoadingCard} from "@/shared/ui";
import {useConfig} from "@/shared/providers/TelegramConfig";
import {useSafeAreaInsets} from "@/shared/providers/SafeAreaWrapper";

export const OrganizerEventsPage = () => {
  const { type, id } = useLocalSearchParams<{ type: "organization" | "user", id: string }>()
  const {events, getEvents, isLoading, swipedAll, setSwipedAll} = useOrganizerEventsStore();

  const onEvent = useConfig().onEvent;
  const { bottom} = useSafeAreaInsets();
  const NAV_BAR_HEIGHT = 57;
  const { height } = Dimensions.get('window');
  const [swiperHeight, setSwiperHeight] = useState(height - NAV_BAR_HEIGHT - bottom);

  useEffect(() => {
    onEvent("viewportChanged", () => {
      // @ts-ignore
      setSwiperHeight(window.Telegram.WebApp.viewportHeight - NAV_BAR_HEIGHT - bottom);
    })
  }, [setSwiperHeight]);

  useFocusEffect(
    useCallback(() => {
      getEvents(type, id);
    }, [getEvents])
  )

  if (events == undefined || isLoading) {
    return <LoadingCard style={{ width: "100%", height: "100%" }}/>
  }

  return (
    <View
      style={{ flex: 1, backgroundColor: "white", width: "100%" }}
    >
      <EventsVerticalSwiper events={events} setSwipedAll={setSwipedAll} swipedAll={swipedAll} back containerHeight={swiperHeight} isLoading={isLoading}/>
    </View>
  );
};

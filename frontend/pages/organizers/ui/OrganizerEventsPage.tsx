import React, {useCallback} from "react";
import {View} from "react-native";
import {EventsSwiper} from "@/widgets/events-swiper";
import {useFocusEffect, useLocalSearchParams} from "expo-router";
import {useOrganizerEventsStore} from "@/features/organizer-content";
import {LoadingCard} from "@/shared/ui";

export const OrganizerEventsPage = () => {
  const { type, id } = useLocalSearchParams<{ type: "organization" | "user", id: string }>()
  const {events, getEvents, isLoading, swipedAll, setSwipedAll} = useOrganizerEventsStore();

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
      style={{ flex: 1, backgroundColor: "white" }}
    >
      <EventsSwiper events={events} setSwipedAll={setSwipedAll} swipedAll={swipedAll} back/>
    </View>
  );
};

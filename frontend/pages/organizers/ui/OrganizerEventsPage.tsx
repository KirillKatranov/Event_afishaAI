import React, {useCallback} from "react";
import {Dimensions, View} from "react-native";
import {EventsSwiper, EventsVerticalSwiper} from "@/widgets/events-swiper";
import {useFocusEffect, useLocalSearchParams} from "expo-router";
import {useOrganizerEventsStore} from "@/features/organizer-content";
import {LoadingCard} from "@/shared/ui";

export const OrganizerEventsPage = () => {
  const { type, id } = useLocalSearchParams<{ type: "organization" | "user", id: string }>()
  const {events, getEvents, isLoading, swipedAll, setSwipedAll} = useOrganizerEventsStore();

  const { height } = Dimensions.get('window');
  const reelsHeight = height - 57;

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
      {/*<EventsSwiper events={events} setSwipedAll={setSwipedAll} swipedAll={swipedAll} back/>*/}
      <EventsVerticalSwiper events={events} setSwipedAll={setSwipedAll} swipedAll={swipedAll} back containerHeight={reelsHeight}/>
    </View>
  );
};

import React, {useEffect} from "react";
import {Pressable, View} from "react-native";
import {EventsSwiper} from "@/widgets/events-swiper";
import {useLocalSearchParams, useRouter} from "expo-router";
import {useOrganizerEventsStore} from "@/features/organizer-content";
import {LoadingCard} from "@/shared/ui";
import Icon from "@/shared/ui/Icons/Icon";
import {useTheme} from "@shopify/restyle";
import {Theme} from "@/shared/providers/Theme";

export const OrganizerEventsPage = () => {
  const { type, id } = useLocalSearchParams<{ type: "organization" | "user", id: string }>()
  const {events, getEvents, isLoading, swipedAll, setSwipedAll} = useOrganizerEventsStore();
  const router = useRouter();
  const theme = useTheme<Theme>()

  useEffect(() => {
    if (events == undefined) getEvents(type, id);
  }, [events, getEvents]);

  if (events == undefined || isLoading) {
    return <LoadingCard style={{ width: "100%", height: "100%" }}/>
  }

  return (
    <View
      style={{ flex: 1, backgroundColor: "white" }}
    >
      <Pressable
        onPress={() => {
          router.back();
        }}
        style={{ position: "absolute", zIndex: 1, top: 20, left: 20 }}
      >
        <View
          style={{ width: 40, height: 40, borderRadius: 100, alignItems: "center", justifyContent: "center" }}
        >
          <Icon name={"chevronLeft"} color={theme.colors.text_color} size={24}/>
        </View>
      </Pressable>

      <EventsSwiper events={events} setSwipedAll={setSwipedAll} swipedAll={swipedAll}/>
    </View>
  );
};

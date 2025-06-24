import React, {useEffect, useState} from "react";
import {EventsVerticalSwiper} from "@/widgets/events-swiper";
import {Box, ErrorCard} from "@/shared/ui";
import {useFeedStore} from "@/features/content";
import {getPeriodBorders} from "@/shared/scripts/date";
import {useConfig} from "@/shared/providers/TelegramConfig";
import {useCalendarStore} from "@/features/dates";
import {Dimensions} from "react-native";
import {useSafeAreaInsets} from "@/shared/providers/SafeAreaWrapper";

export const FeedPage = () => {
  const username = useConfig().initDataUnsafe.user.username;
  const onEvent = useConfig().onEvent;
  const {
    feed,
    isLoading, hasError,
    swipedAll, setSwipedAll,
    fetchFeed,
    fetchSearch, fetchSuggestions,
    searchQuery, setSearchQuery
  } = useFeedStore();
  const { selectedDays} = useCalendarStore();

  const NAV_BAR_HEIGHT = 57;
  const { bottom} = useSafeAreaInsets();
  const { height } = Dimensions.get('window');
  const [swiperHeight, setSwiperHeight] = useState(height - NAV_BAR_HEIGHT - bottom);

  useEffect(() => {
    onEvent("viewportChanged", () => {
      // @ts-ignore
      setSwiperHeight(window.Telegram.WebApp.viewportHeight - NAV_BAR_HEIGHT - bottom);
    })
  }, [setSwiperHeight]);

  useEffect(() => {
    const borders = getPeriodBorders(Object.keys(selectedDays));
    fetchFeed({
      username: username,
      date_start: borders.date_start,
      date_end: borders.date_end
    });
  }, [selectedDays]);

  const onSearch = (query: string) => {
    const borders = getPeriodBorders(Object.keys(selectedDays));
    if (query === "") {
      fetchFeed({
        username: username,
        date_start: borders.date_start,
        date_end: borders.date_end
      });
    } else {
      fetchSearch({
        q: query,
        date_from: borders.date_start,
        date_to: borders.date_end
      })
    }
  }

  if (hasError) return <ErrorCard />

  return (
    <Box
      flex={1}
      flexDirection="column"
    >
      <EventsVerticalSwiper
        events={feed}
        isLoading={isLoading}
        swipedAll={swipedAll} setSwipedAll={setSwipedAll}
        containerHeight={swiperHeight}
        allowSearch
        searchUtils={{
          query: searchQuery, setQuery: setSearchQuery,
          onSearch: onSearch,
          fetchSuggestions: fetchSuggestions
        }}
      />
    </Box>
  )
}

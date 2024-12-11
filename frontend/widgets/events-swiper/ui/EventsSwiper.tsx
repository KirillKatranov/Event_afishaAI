import React, {useEffect, useMemo, useRef} from "react";
import {Pressable} from "react-native";
import {useRouter} from "expo-router";
import Animated, {useAnimatedStyle, useSharedValue, withTiming} from "react-native-reanimated";
import {useTheme} from "@shopify/restyle";
import Swiper from "react-native-deck-swiper";
import {useEventsSwiperStore} from "@/widgets/events-swiper/model/store/useEventsSwiperStore";
import {useCalendarStore} from "@/features/dates";
import {useLikesStore} from "@/features/likes-dislikes";
import {useSelectedTagStore} from "@/features/tag-selected";
import {Event, EventCard, useEventCardStore} from "@/entities/event";
import {Box, ErrorCard, LoadingCard} from "@/shared/ui";
import {Text} from "@/shared/ui";
import {Theme} from "@/shared/providers/Theme";
import {useConfig} from "@/shared/providers/TelegramConfig";
import {getPeriodBorders} from "@/shared/scripts/date";
import Icon from "@/shared/ui/Icons/Icon";

export const EventsSwiper = () => {
  const theme = useTheme<Theme>();
  const router = useRouter();
  const username = useConfig().initDataUnsafe.user.username;
  const swiperRef = useRef<Swiper<Event> | null>();

  const {
    events,
    isLoading, hasError,
    swipedAll, setSwipedAll,
    fetchEvents,
    swipeEnabled, setSwipeEnabled
  } = useEventsSwiperStore();

  const { selectedDays} = useCalendarStore();
  const { tag, setTag } = useSelectedTagStore();
  const { addLikedEvent, removeLikedEvent, saveAction } = useLikesStore();
  const { descriptionExpanded, descriptionSwiping, tagsScrolling } = useEventCardStore();

  useEffect(() => {
    if (descriptionExpanded || descriptionSwiping || tagsScrolling) {
      setSwipeEnabled(false)
    } else {
      setSwipeEnabled(true)
    }
  }, [descriptionExpanded, descriptionSwiping, tagsScrolling]);

  const swipedAllInfoOpacity = useSharedValue(0);

  const swipedAllInfoStyle = useAnimatedStyle(() => ({
    opacity: swipedAllInfoOpacity.value,
    gap: 16
  }));

  const likeOpacity = useSharedValue(0);
  const dislikeOpacity = useSharedValue(0);

  const likeStyle = useAnimatedStyle(() => ({
    opacity: likeOpacity.value,
    transform: [{ translateX: withTiming(likeOpacity.value ? -20 : 20) }],
  }));
  const dislikeStyle = useAnimatedStyle(() => ({
    opacity: dislikeOpacity.value,
    transform: [{ translateX: withTiming(dislikeOpacity.value ? 20 : -20) }],
  }));

  const resetOpacity = () => {
    likeOpacity.value = withTiming(0);
    dislikeOpacity.value = withTiming(0);
  }

  useEffect(() => {
    const borders = getPeriodBorders(Object.keys(selectedDays));
    fetchEvents(tag, borders.date_start, borders.date_end);
  }, [tag, selectedDays]);

  useEffect(() => {
    if (swipedAll) {
      swipedAllInfoOpacity.value = withTiming(1);
    } else {
      swipedAllInfoOpacity.value = withTiming(0);
    }
  }, [swipedAll]);

  const renderCard = useMemo(() => {
    return (event: Event) => (
      <EventCard
        event={event}
        onLike={() => {
          swiperRef.current?.swipeRight();
        }}
        onDislike={() => {
          swiperRef.current?.swipeLeft();
        }}
      />
    );
  }, []);


  if (isLoading) return <LoadingCard style={{ flex: 1, height: "100%", width: "100%" }}/>
  if (hasError) return <ErrorCard />

  return (
    <Box
      flex={1}
      backgroundColor="bg_color"
    >
      {
        !swipedAll && (
          <Box flex={1} backgroundColor="bg_color">
            <Swiper
              ref={swiper => {
                swiperRef.current = swiper;
              }}
              cards={events}
              renderCard={renderCard}
              keyExtractor={(event) => event.id.toString()}
              backgroundColor="white"
              horizontalSwipe={swipeEnabled}
              verticalSwipe={false}
              stackSize={2}
              containerStyle={{ backgroundColor: theme.colors.bg_color }}
              cardStyle={{ height: "100%" }}
              cardVerticalMargin={0}
              cardHorizontalMargin={0}
              childrenOnTop={true}
              onSwipedAll={() => setSwipedAll(true)}
              onSwipedRight={(cardIndex) => {
                saveAction("like", events[cardIndex].id, username)
                  .then(() => addLikedEvent(events[cardIndex]))
              }}
              onSwipedLeft={(cardIndex) => {
                saveAction("dislike", events[cardIndex].id, username)
                  .then(() => removeLikedEvent(events[cardIndex].id))
              }}
              onSwiping={(x) => {
                likeOpacity.value = x > 0 ? Math.min(x / 100, 1) : 0;
                dislikeOpacity.value = x < 0 ? Math.min(-x / 100, 1) : 0;
              }}
              onSwiped={resetOpacity}
              onSwipedAborted={resetOpacity}
              inputRotationRange={[-100 / 2, 0, 100 / 2]}
              outputRotationRange={["0deg", "0deg", "0deg"]}
            />

            {/* Иконка лайка */}
            <Animated.View style={[likeStyle, { position: "absolute", right: 0, top: "50%" }]}>
              <Box width={50} height={50} alignItems={"center"} justifyContent={"center"}
                   backgroundColor={"red"} borderRadius={"l"}>
                <Icon name={"likeFilled"} color={theme.colors.gray} size={24}/>
              </Box>
            </Animated.View>

            {/* Иконка дизлайка */}
            <Animated.View style={[dislikeStyle, { position: "absolute", left: 0, top: "50%" }]}>
              <Box width={50} height={50} alignItems={"center"} justifyContent={"center"}
                   backgroundColor={"gray"} borderRadius={"l"}>
                <Icon name={"dislike"} color={theme.colors.red} size={24}/>
              </Box>
            </Animated.View>
          </Box>
        )
      }

      {/* Back button */}
      {
        tag && !swipedAll && (
          <Pressable
            onPress={() => {
              router.replace("/(tabs)/tags");
              setTag(undefined);
            }}
            style={{
              backgroundColor: theme.colors.cardBGColor,
              width: 36, height: 36,
              position: "absolute",
              top: 16, left: 16,
              borderRadius: 50,
              zIndex: 1, alignItems: "center", justifyContent: "center"
            }}
          >
            <Icon name={"chevronLeft"} color={theme.colors.gray} size={24}/>
          </Pressable>
        )
      }

      {
        swipedAll && (
          <Box
            flex={1}
            alignItems="center"
            justifyContent="center"
            backgroundColor="bg_color"
            padding="xl"
          >
            <Animated.View
              style={ swipedAllInfoStyle }
            >
              <Text
                variant="body"
                color="text_color"
                textAlign="center"
              >
                { tag ? "Мероприятия в этой категории закончились" : "Мероприятия закончились" }
              </Text>

              {
                tag && (
                  <Pressable
                    onPress={ () => {
                      router.navigate("/tags");
                      setTag(undefined);
                    }}
                  >
                    <Box
                      flexDirection="row"
                      height={44}
                      padding="l"
                      alignItems="center"
                      justifyContent="center"
                      backgroundColor="button_color"
                      style={{
                        borderRadius: 12
                      }}
                    >
                      <Text
                        variant="body"
                        color="button_text_color"
                      >
                        { "Выбрать другую категорию" }
                      </Text>
                    </Box>
                  </Pressable>
                )
              }

              {
                Object.keys(selectedDays).length > 0 && (
                  <Pressable
                    onPress={ () => router.navigate("/(tabs)/calendar")}
                  >
                    <Box
                      flexDirection="row"
                      height={44}
                      padding="l"
                      alignItems="center"
                      justifyContent="center"
                      backgroundColor="button_color"
                      style={{
                        borderRadius: 12
                      }}
                    >
                      <Text
                        variant="body"
                        color="button_text_color"
                      >
                        { "Изменить даты мероприятий" }
                      </Text>
                    </Box>
                  </Pressable>
                )
              }
            </Animated.View>
          </Box>
        )
      }
    </Box>
  )
}

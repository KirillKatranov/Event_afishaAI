import React, {useEffect, useRef, useState} from "react";
import {FlatList, Image, Modal, Pressable} from "react-native";
import {useLocalSearchParams, useRouter} from "expo-router";
import Animated, {useAnimatedStyle, useSharedValue, withTiming} from "react-native-reanimated";
import {useTheme} from "@shopify/restyle";
import Swiper from "react-native-deck-swiper";
import {useCalendarStore} from "@/features/dates";
import {useReactionsStore} from "@/features/likes-dislikes";
import {Event, EventCard, useEventCardStore} from "@/entities/event";
import {Box, LoadingCard} from "@/shared/ui";
import {Text} from "@/shared/ui";
import {Theme} from "@/shared/providers/Theme";
import {useConfig} from "@/shared/providers/TelegramConfig";
import Icon from "@/shared/ui/Icons/Icon";
import {getEventCardsLayout, setEventCardsLayout} from "@/shared/utils/storage/layoutSettings";
import {CatalogEventCard} from "@/entities/event/ui/CatalogEventCard";
import {useCatalogLikesStore} from "@/widgets/events-swiper";

interface EventsSwiperProps {
  events: Event[];
  swipedAll: boolean; setSwipedAll: (swipedAll: boolean) => void;
}

export const EventsSwiper: React.FC<EventsSwiperProps> = ({
  events,
  swipedAll, setSwipedAll
}) => {
  const { tag } = useLocalSearchParams<{ tag: string }>();

  const theme = useTheme<Theme>();
  const router = useRouter();
  const username = useConfig().initDataUnsafe.user.username;
  const swiperRef = useRef<Swiper<Event> | null>();

  const [layoutState, setLayoutState] = useState<string | null>(null);

  const [selectedEvent, setEventSelected] = React.useState<Event | undefined>(undefined);
  const [modalVisible, setModalVisible] = React.useState(false);

  useEffect(() => {
    getEventCardsLayout().then((state) => {
      if (!state) {
        setEventCardsLayout("swiper").then(() => console.log("layout state inits"));
        setLayoutState("swiper");
      } else {
        setLayoutState(state);
      }
    })
  }, []);

  const { selectedDays} = useCalendarStore();
  const {
    addLikedEvent, addDislikedEvent,
    removeLikedEvent, removeDislikedEvent,
    saveAction
  } = useReactionsStore();
  const { swipeEnabled } = useEventCardStore();
  const { likedIDs, addLikeID, resetLikesID, removeLikeID } = useCatalogLikesStore()

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
    if (swipedAll) {
      swipedAllInfoOpacity.value = withTiming(1);
    } else {
      swipedAllInfoOpacity.value = withTiming(0);
    }
  }, [swipedAll]);

  useEffect(() => {
    resetLikesID();
  }, [events]);

  const renderCard = (event: Event) => (
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

  const handleLayoutChange = () => {
    setEventCardsLayout(layoutState === "swiper" ? "catalog" : "swiper").then(() => {
      setLayoutState(layoutState === "swiper" ? "catalog" : "swiper")
    });
  }

  if (!layoutState) {
    return <LoadingCard style={{ width: "100%", height: "100%" }}/>
  }

  return (
    <Box
      flex={1}
      backgroundColor="bg_color"
    >
      {
        !swipedAll && layoutState == "swiper" && (
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
              stackSize={3}
              stackScale={0}
              stackSeparation={0}
              stackAnimationTension={100}
              stackAnimationFriction={15}
              swipeBackCard
              containerStyle={{ backgroundColor: theme.colors.bg_color }}
              cardStyle={{ height: "100%" }}
              cardVerticalMargin={0}
              cardHorizontalMargin={0}
              childrenOnTop={true}
              onSwipedAll={() => setSwipedAll(true)}
              onSwipedRight={(cardIndex) => {
                saveAction({
                  action: "like",
                  contentId: events[cardIndex].id,
                  username: username
                }).then(() => {
                  addLikedEvent(events[cardIndex]);
                  removeDislikedEvent(events[cardIndex].id);
                })
              }}
              onSwipedLeft={(cardIndex) => {
                saveAction({
                  action: "dislike",
                  contentId: events[cardIndex].id,
                  username: username
                }).then(() => {
                  addDislikedEvent(events[cardIndex])
                  removeLikedEvent(events[cardIndex].id);
                })
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

      {
        layoutState === "catalog" && !swipedAll && (
          <Box flex={1} style={{ paddingTop: 95 }}>
            <Image
              source={require("@/shared/assets/images/BlurredCircles.png")}
              resizeMode="stretch"
              style={{
                position: "absolute",
                zIndex: -1,
                width: "100%",
                height: 120,
                top: -15,
                opacity: 0.75,
                alignSelf: "center"
              }}
            />

            <FlatList
              data={events}
              renderItem={({ item }) => (
                <CatalogEventCard
                  event={item}
                  liked={likedIDs.some((val) => val == item.id)}
                  onLike={() => {
                    if (likedIDs.some((val) => val == item.id)) {
                      saveAction({
                        action: "delete_mark",
                        contentId: item.id,
                        username: username
                      }).then(() => {
                        removeLikeID(item.id);
                        removeLikedEvent(item.id);
                        removeDislikedEvent(item.id);
                      })
                    } else {
                      saveAction({
                        action: "like",
                        contentId: item.id,
                        username: username
                      }).then(() => {
                        addLikeID(item.id);
                        addLikedEvent(item);
                        removeDislikedEvent(item.id);
                      })
                    }
                  }}
                  onPress={() => {
                    setEventSelected(item);
                    setModalVisible(true);
                  }}
                />
              )}
              numColumns={2}
              showsVerticalScrollIndicator={false}
              columnWrapperStyle={{ gap: 16, marginBottom: 16 }}
              style={{
                flex: 1, gap: 16, paddingHorizontal: 16,
              }}
            />

            <Modal
              visible={modalVisible}
              animationType="slide"
              onDismiss={ () => setEventSelected(undefined) }
              transparent
            >
              {selectedEvent && (
                <Pressable
                  onPress={ () => setModalVisible(false) }
                  style={{ position: "absolute", zIndex: 10, right: 20, top: 20 }}
                >
                  <Box
                    backgroundColor={"cardBGColor"}
                    width={40} height={40}
                    borderRadius={"eventCard"}
                    alignItems={"center"} justifyContent={"center"}
                  >
                    <Icon name={"chevronDown"} color={theme.colors.gray} size={24}/>
                  </Box>
                </Pressable>
              )}

              {selectedEvent && (
                <EventCard
                  event={selectedEvent} expanded
                  onLike={() => saveAction({
                    action: "like",
                    contentId: selectedEvent.id,
                    username: username
                  }).then(() => {
                    addLikedEvent(selectedEvent);
                    removeDislikedEvent(selectedEvent.id);
                    setModalVisible(false);
                  })}
                  onDislike={() => {
                    saveAction({
                      action: "dislike",
                      contentId: selectedEvent.id,
                      username: username
                    }).then(() => {
                      addDislikedEvent(selectedEvent);
                      removeLikedEvent(selectedEvent.id);
                      setModalVisible(false);
                    })
                  }}
                />
              )}
            </Modal>
          </Box>
        )
      }

      {/* Buttons area */}
      <Box
        flexDirection={"row"}
        height={16 + 40 + 16}
        gap={"m"}
        justifyContent={"flex-start"}
        position={"absolute"} zIndex={1}
        alignSelf={"flex-start"}
        style={{
          paddingTop: 20,
          paddingLeft: 20
        }}
      >
        {!swipedAll && (
          <Pressable onPress={handleLayoutChange}>
            <Box
              backgroundColor={"cardBGColor"}
              width={40} height={40}
              borderRadius={"eventCard"}
              alignItems={"center"} justifyContent={"center"}
            >
              <Icon name={layoutState === "swiper" ? "catalog" : "swiper"} color={theme.colors.gray} size={24}/>
            </Box>
          </Pressable>
        )}

        {/* Back button */}
        {
          tag && !swipedAll && (
            <Pressable
              onPress={() => {
                router.back();
              }}
            >
              <Box
                backgroundColor={"cardBGColor"}
                width={40} height={40}
                borderRadius={"eventCard"}
                alignItems={"center"} justifyContent={"center"}
              >
                <Icon name={"chevronLeft"} color={theme.colors.gray} size={24}/>
              </Box>
            </Pressable>
          )
        }

        {/* Swipe back card button */}
        {
          !swipedAll && layoutState === "swiper" && (
            <Pressable
              onPress={ () => swiperRef.current?.swipeBack() }
            >
              <Box
                backgroundColor={"cardBGColor"}
                width={40} height={40}
                borderRadius={"eventCard"}
                alignItems={"center"} justifyContent={"center"}
              >
                <Icon name={"back"} color={theme.colors.gray} size={24}/>
              </Box>
            </Pressable>
          )
        }
      </Box>

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
                    onPress={ () => router.back() }
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
                    onPress={ () => router.navigate("/calendar")}
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
                        textAlign={"center"}
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

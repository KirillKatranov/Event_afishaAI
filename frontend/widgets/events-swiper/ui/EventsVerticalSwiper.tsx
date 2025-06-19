import React, { useEffect, useRef, useState } from "react";
import { FlatList, Image, Modal, Pressable, ViewToken } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import { useTheme } from "@shopify/restyle";
import { useCalendarStore } from "@/features/dates";
import { useReactionsStore } from "@/features/likes-dislikes";
import { Event, EventCard } from "@/entities/event";
import { Box, LoadingCard } from "@/shared/ui";
import { Text } from "@/shared/ui";
import { Theme } from "@/shared/providers/Theme";
import { useConfig } from "@/shared/providers/TelegramConfig";
import Icon from "@/shared/ui/Icons/Icon";
import { getEventCardsLayout, setEventCardsLayout } from "@/shared/utils/storage/layoutSettings";
import { CatalogEventCard } from "@/entities/event/ui/CatalogEventCard";
import { useCatalogLikesStore } from "@/widgets/events-swiper";
import Illustration from "@/shared/ui/Illustrations/Illustration";

interface EventsSwiperProps {
  events: Event[];
  swipedAll: boolean;
  setSwipedAll: (swipedAll: boolean) => void;
  back?: boolean;
  containerHeight: number;
}

export const EventsVerticalSwiper: React.FC<EventsSwiperProps> = ({
  events,
  swipedAll,
  setSwipedAll,
  back,
  containerHeight,
}) => {
  const { service, tag, owned } = useLocalSearchParams<{ service: string; tag: string; owned: string }>();

  const theme = useTheme<Theme>();
  const router = useRouter();
  const username = useConfig().initDataUnsafe.user.username;
  const flatListRef = useRef<FlatList<Event>>(null);

  const [layoutState, setLayoutState] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

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
    });
  }, []);

  const { selectedDays } = useCalendarStore();
  const {
    addLikedEvent,
    addDislikedEvent,
    removeLikedEvent,
    removeDislikedEvent,
    saveAction,
  } = useReactionsStore();
  const { likedIDs, addLikeID, resetLikesID, removeLikeID } = useCatalogLikesStore();

  const swipedAllInfoOpacity = useSharedValue(0);
  const swipedAllInfoStyle = useAnimatedStyle(() => ({
    opacity: swipedAllInfoOpacity.value,
    gap: 40,
  }));

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

  const handleLike = async (event: Event) => {
    await saveAction({
      action: "like",
      contentId: event.id,
      username: username,
    });
    addLikeID(event.id);
    addLikedEvent(event);
    removeDislikedEvent(event.id);
  };

  const handleDislike = async (event: Event) => {
    await saveAction({
      action: "dislike",
      contentId: event.id,
      username: username,
    });
    removeLikeID(event.id);
    addDislikedEvent(event);
    removeLikedEvent(event.id);
  };

  const handleLayoutChange = () => {
    setEventCardsLayout(layoutState === "swiper" ? "catalog" : "swiper").then(() => {
      setLayoutState(layoutState === "swiper" ? "catalog" : "swiper");
    });
  };

  const onViewableItemsChanged = useRef(({ viewableItems }: { viewableItems: ViewToken[] }) => {
    if (viewableItems.length > 0 && viewableItems[0].index !== null) {
      setCurrentIndex(viewableItems[0].index);
    }
  }).current;

  const viewabilityConfig = {
    itemVisiblePercentThreshold: 90,
  };

  const renderReelsCard = ({ item }: { item: Event }) => (
    <Box height={containerHeight} width="100%">
      <EventCard
        event={item}
        onLike={() => handleLike(item)}
        onDislike={() => handleDislike(item)}
        owned={!!owned}
      />
    </Box>
  );

  const renderCatalogItem = ({ item }: { item: Event }) => (
    <CatalogEventCard
      event={item}
      liked={likedIDs.some((val) => val == item.id)}
      onLike={() => {
        if (likedIDs.some((val) => val == item.id)) {
          saveAction({
            action: "delete_mark",
            contentId: item.id,
            username: username,
          }).then(() => {
            removeLikeID(item.id);
            removeLikedEvent(item.id);
            removeDislikedEvent(item.id);
          });
        } else {
          handleLike(item);
        }
      }}
      onPress={() => {
        setEventSelected(item);
        setModalVisible(true);
      }}
    />
  );

  if (!layoutState) {
    return <LoadingCard style={{ width: "100%", height: "100%" }} />;
  }

  return (
    <Box flex={1} backgroundColor="bg_color">
      {!swipedAll && layoutState === "swiper" && (
        <Box flex={1}>
          <FlatList
            ref={flatListRef}
            data={events}
            renderItem={renderReelsCard}
            keyExtractor={(item) => item.id.toString()}
            pagingEnabled
            showsVerticalScrollIndicator={false}
            snapToInterval={containerHeight}
            snapToAlignment="start"
            decelerationRate="fast"
            onViewableItemsChanged={onViewableItemsChanged}
            viewabilityConfig={viewabilityConfig}
          />
        </Box>
      )}

      {layoutState === "catalog" && !swipedAll && (
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
              alignSelf: "center",
            }}
          />

          <FlatList
            data={events}
            renderItem={renderCatalogItem}
            numColumns={2}
            showsVerticalScrollIndicator={false}
            columnWrapperStyle={{ gap: 16, marginBottom: 16 }}
            style={{
              flex: 1,
              gap: 16,
              paddingHorizontal: 16,
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
                  addLikeID(selectedEvent.id);
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
                    removeLikeID(selectedEvent.id);
                    addDislikedEvent(selectedEvent);
                    removeLikedEvent(selectedEvent.id);
                    setModalVisible(false);
                  })
                }}
              />
            )}
          </Modal>
        </Box>
      )}

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
          ((tag && !swipedAll) || back) && (
            <Pressable
              onPress={ () => {
                if (back) router.back()
                else router.navigate({ pathname: "/tags/[service]", params: { service: service }})
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
              style={swipedAllInfoStyle}
            >
              <Text
                variant="body"
                color="text_color"
                textAlign="center"
              >
                { tag ? "Мероприятия в этой категории закончились" : "Мероприятия закончились" }
              </Text>

              <Box alignItems={"center"}>
                <Illustration name={"sadArrow"}/>
              </Box>

              {
                tag && (
                  <Pressable
                    onPress={ () => router.replace({ pathname: "/tags/[service]", params: { service: service }}) }
                  >
                    <Box
                      flexDirection="row"
                      height={62}
                      alignItems="center" justifyContent="center"
                      style={{
                        borderRadius: 28,
                        paddingHorizontal: 30, paddingVertical: 20,
                        backgroundColor: "#6361DD"
                      }}
                    >
                      <Text color={"white"} style={{ fontFamily: "MontserratMedium", fontSize: 16 }}>
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
                      height={62}
                      alignItems="center" justifyContent="center"
                      style={{
                        borderRadius: 28,
                        paddingHorizontal: 30, paddingVertical: 20,
                        backgroundColor: "#6361DD"
                      }}
                    >
                      <Text color={"white"} style={{ fontFamily: "MontserratMedium", fontSize: 16 }}>
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
  );
};

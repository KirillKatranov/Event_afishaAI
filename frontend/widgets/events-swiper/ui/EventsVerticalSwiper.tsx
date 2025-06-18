import React, {useCallback, useEffect, useRef, useState} from "react";
import {
  Animated,
  FlatList,
  Image,
  Modal,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Pressable,
  View,
} from "react-native";
import {useLocalSearchParams, useRouter} from "expo-router";
import {useAnimatedStyle, useSharedValue, withTiming} from "react-native-reanimated";
import {useTheme} from "@shopify/restyle";
import {useCalendarStore} from "@/features/dates";
import {useReactionsStore} from "@/features/likes-dislikes";
import {Event, EventCard} from "@/entities/event";
import {Box, LoadingCard, Text} from "@/shared/ui";
import {Theme} from "@/shared/providers/Theme";
import {useConfig} from "@/shared/providers/TelegramConfig";
import Icon from "@/shared/ui/Icons/Icon";
import {getEventCardsLayout, setEventCardsLayout} from "@/shared/utils/storage/layoutSettings";
import {CatalogEventCard} from "@/entities/event/ui/CatalogEventCard";
import {useCatalogLikesStore} from "@/widgets/events-swiper";
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

  const PAGE_SIZE = 1;
  const BUFFER = 1;
  const [allEvents] = useState<Event[]>(events); // Сохраняем все данные
  const [visibleData, setVisibleData] = useState<Event[]>([]);
  const scrollEndTimeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    getEventCardsLayout().then((state) => {
      setLayoutState(state || "swiper");
      if (!state) setEventCardsLayout("swiper");
    });
    setVisibleData(allEvents.slice(0, 2));
  }, [allEvents]);

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
    swipedAllInfoOpacity.value = withTiming(swipedAll ? 1 : 0);
  }, [swipedAll]);

  useEffect(() => {
    resetLikesID();
  }, [events]);

  const handleEventAction = useCallback(async (action: "like" | "dislike" | "delete_mark", event: Event) => {
    await saveAction({
      action,
      contentId: event.id,
      username,
    });

    if (action === "like") {
      addLikeID(event.id);
      addLikedEvent(event);
      removeDislikedEvent(event.id);
    } else if (action === "dislike") {
      removeLikeID(event.id);
      addDislikedEvent(event);
      removeLikedEvent(event.id);
    } else {
      removeLikeID(event.id);
      removeLikedEvent(event.id);
      removeDislikedEvent(event.id);
    }
  }, [username]);

  const handleLayoutChange = useCallback(() => {
    const newLayout = layoutState === "swiper" ? "catalog" : "swiper";
    setEventCardsLayout(newLayout).then(() => setLayoutState(newLayout));
  }, [layoutState]);

  // Упрощенный обработчик скролла
  const handleScroll = useCallback((event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    console.log(offsetY, containerHeight)
    const newIndex = Math.round(offsetY / containerHeight);
    setCurrentIndex(newIndex);

    if (scrollEndTimeout.current) {
      clearTimeout(scrollEndTimeout.current);
    }
    scrollEndTimeout.current = setTimeout(() => {
      if (newIndex >= visibleData.length - BUFFER && visibleData.length < allEvents.length) {
        const nextChunkSize = Math.min(PAGE_SIZE, allEvents.length - visibleData.length);
        const newVisibleData = [
          ...visibleData,
          ...allEvents.slice(visibleData.length, visibleData.length + nextChunkSize)
        ];
        setVisibleData(newVisibleData);

        requestAnimationFrame(() => {
          flatListRef.current?.scrollToIndex({
            index: newIndex,
            animated: false,
          });
        });
      }
    }, 100);
  }, [containerHeight, visibleData]);

  const renderItem = useCallback(({ item, index }: { item: Event, index: number }) => {
    const isVisible = index >= currentIndex - BUFFER && index <= currentIndex + BUFFER;

    return (
      <View style={{ height: containerHeight, width: '100%' }}>
        {isVisible ? (
          <EventCard
            event={item}
            onLike={() => handleEventAction("like", item)}
            onDislike={() => handleEventAction("dislike", item)}
            owned={!!owned}
          />
        ) : (
          <View style={{ height: containerHeight }} />
        )}
      </View>
    );
  }, [currentIndex, containerHeight, owned]);

  const renderCatalogItem = useCallback(({ item }: { item: Event }) => (
    <CatalogEventCard
      event={item}
      liked={likedIDs.includes(item.id)}
      onLike={() => handleEventAction(
        likedIDs.includes(item.id) ? "delete_mark" : "like",
        item
      )}
      onPress={() => {
        setEventSelected(item);
        setModalVisible(true);
      }}
    />
  ), [likedIDs]);

  if (!layoutState) {
    return <LoadingCard style={{ width: "100%", height: "100%" }} />;
  }


  return (
    <Box flex={1} backgroundColor="bg_color">
      {!swipedAll && layoutState === "swiper" && (
        <FlatList
          ref={flatListRef}
          data={visibleData}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          showsVerticalScrollIndicator={false}
          snapToInterval={containerHeight}
          snapToAlignment="start"
          pagingEnabled
          decelerationRate={0.0}
          disableIntervalMomentum
          onScroll={handleScroll}
          initialNumToRender={PAGE_SIZE}
          maxToRenderPerBatch={PAGE_SIZE}
          windowSize={5}
          removeClippedSubviews
          style={{
            overscrollBehavior: 'none',
          }}
          getItemLayout={(_data, index) => ({
            length: containerHeight,
            offset: containerHeight * index,
            index,
          })}
        />
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
                if (back) router.replace("/tags/organizers");
                else router.navigate({ pathname: "/tags/[service]", params: { service: service }});
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

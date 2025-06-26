import React, {useCallback, useEffect, useState} from "react";
import {
  Animated, Dimensions,
  FlatList,
  Image,
  Modal,
  Pressable,
  View,
} from "react-native";
import {useLocalSearchParams, useRouter} from "expo-router";
import {useAnimatedStyle, useSharedValue, withTiming} from "react-native-reanimated";
import {useTheme} from "@shopify/restyle";
import {useCalendarStore} from "@/features/dates";
import {useReactionsStore} from "@/features/likes-dislikes";
import {Event, EventCard} from "@/entities/event";
import {Box, GradientText, LoadingCard, SearchBar, Text} from "@/shared/ui";
import {Theme} from "@/shared/providers/Theme";
import {useConfig} from "@/shared/providers/TelegramConfig";
import Icon from "@/shared/ui/Icons/Icon";
import {getEventCardsLayout, setEventCardsLayout} from "@/shared/utils/storage/layoutSettings";
import {CatalogEventCard} from "@/entities/event/ui/CatalogEventCard";
import {useCatalogLikesStore} from "@/widgets/events-swiper";
import Illustration from "@/shared/ui/Illustrations/Illustration";
import Carousel, {ICarouselInstance} from "react-native-reanimated-carousel";

interface EventsSwiperProps {
  events: Event[];
  isLoading: boolean;
  swipedAll: boolean;
  setSwipedAll: (swipedAll: boolean) => void;
  back?: boolean;
  tag?: string;
  containerHeight: number;
  allowSearch?: boolean;
  searchUtils?: {
    query: string, setQuery: (query: string) => void;
    onSearch: (query: string) => void;
    fetchSuggestions: (query: string) => Promise<string[]>;
  };
}

const width = Dimensions.get("window").width;

export const EventsVerticalSwiper: React.FC<EventsSwiperProps> = ({
  events,
  isLoading,
  swipedAll,
  back,
  tag,
  containerHeight,
  allowSearch,
  searchUtils,
}) => {
  const { service, owned } = useLocalSearchParams<{ service: string; tag: string; owned: string }>();

  const theme = useTheme<Theme>();
  const router = useRouter();
  const config = useConfig();
  const username = useConfig().initDataUnsafe.user.username;

  const [layoutState, setLayoutState] = useState<string | null>(null);

  const ref = React.useRef<ICarouselInstance>(null);
  const progress = useSharedValue<number>(0);

  const [selectedEvent, setEventSelected] = React.useState<Event | undefined>(undefined);
  const [modalVisible, setModalVisible] = React.useState(false);
  const [currentIndex, setCurrentIndex] = React.useState(0);

  useEffect(() => {
    getEventCardsLayout().then((state) => {
      setLayoutState(state || "catalog");
      if (!state) setEventCardsLayout("catalog");
    });
  }, []);

  useEffect(() => {
    window.addEventListener("wheel", (e) => {
      if (e.deltaY > 0) {
        ref.current?.next();
      } else if (e.deltaY < 0) {
        ref.current?.prev();
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
        <>
          {!isLoading && (
            <Carousel
              ref={ref}
              width={width}
              height={containerHeight}
              data={events}
              onProgressChange={progress}
              vertical
              snapEnabled
              windowSize={3}
              loop={false}
              defaultIndex={currentIndex}
              onSnapToItem={(index) => setCurrentIndex(index)}
              renderItem={({ item }: { item: Event }) => {
                return (
                  <View style={{ height: containerHeight, width: '100%' }}>
                    <EventCard
                      event={item}
                      onLike={() => handleEventAction("like", item)}
                      onDislike={() => handleEventAction("dislike", item)}
                      owned={!!owned}
                    />
                  </View>
                );
              }}
            />
          )}

          {isLoading && <LoadingCard style={{ flex: 1, height: "100%", width: "100%" }}/>}
        </>
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

          {isLoading && <LoadingCard style={{ flex: 1, height: "100%", width: "100%" }}/>}
          {!isLoading && (
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
          )}

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
        width={"100%"}
        gap={"m"}
        justifyContent={"flex-start"}
        position={"absolute"} zIndex={1}
        alignSelf={"flex-start"}
        style={{
          paddingTop: 20,
          paddingLeft: 20,
          paddingRight: 72,
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

        {layoutState === "catalog" && allowSearch && searchUtils && (
          <SearchBar
            query={searchUtils.query} setQuery={searchUtils.setQuery}
            onSearch={searchUtils.onSearch}
            fetchSuggestions={searchUtils.fetchSuggestions}
          />
        )}


        {layoutState === "catalog" && !allowSearch && tag && (
          <View
            style={{
              flex: 1, height: 30,
              alignItems: "center", justifyContent: "center",
              backgroundColor: "rgba(255,255,255,0.5)",
              borderRadius: 10, marginTop: 5,
            }}
          >
            <GradientText
              id={tag}
              colors={["#E600FF", "#C700FF", "#8E00FF", "#6F01C7"]}
              stops={[0, 0.21, 0.66, 1]}
              text={tag.toUpperCase()} fontSize={20} textStyle={{ fontFamily: "UnboundedExtraBold" }}
              gradientStop={{ x: 0, y: 1 }}
            />
          </View>
        )}

        {layoutState !== "catalog" && (
          <Pressable
            onPress={ () => {
              const link = `${process.env.EXPO_PUBLIC_WEB_APP_URL}?startapp=${events[currentIndex].id}`;
              const encodedMessage = encodeURIComponent(`Привет! Посмотри это мероприятие`);

              console.log("Sharing event with link:", link);

              config.openTelegramLink(`https://t.me/share/url?text=${encodedMessage}&url=${link}`);
            }}
          >
            <Box
              backgroundColor={"cardBGColor"}
              height={40}
              width={40}
              alignItems={"center"}
              justifyContent={"center"}
              borderRadius={"xl"}
            >
              <Icon
                name={"share"}
                color={theme.colors.white}
                size={24}
              />
            </Box>
          </Pressable>
        )}
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
              style={[swipedAllInfoStyle, { gap: 40 }]}
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

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
import {Event, EventCard, useEventCardStore} from "@/entities/event";
import {Box, GradientText, LoadingCard, SearchBar, Text} from "@/shared/ui";
import {Theme} from "@/shared/providers/Theme";
import {useConfig} from "@/shared/providers/TelegramConfig";
import Icon from "@/shared/ui/Icons/Icon";
import {getEventCardsLayout, setEventCardsLayout} from "@/shared/utils/storage/layoutSettings";
import {CatalogEventCard} from "@/entities/event/ui/CatalogEventCard";
import Illustration from "@/shared/ui/Illustrations/Illustration";
import Carousel, {ICarouselInstance} from "react-native-reanimated-carousel";
import {getPeriodBorders} from "@/shared/scripts/date";

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
    fetchSuggestions: (query: string, username: string) => Promise<string[]>;
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
  const user = useConfig().initDataUnsafe.user;

  const [layoutState, setLayoutState] = useState<string | null>(null);

  const ref = React.useRef<ICarouselInstance>(null);

  const [selectedEvent, setEventSelected] = React.useState<Event | undefined>(undefined);
  const [modalVisible, setModalVisible] = React.useState(false);
  const [currentIndex, setCurrentIndex] = React.useState(0);

  useEffect(() => {
    getEventCardsLayout().then((state) => {
      setLayoutState(state || "catalog");
      if (!state) setEventCardsLayout("catalog").then(() => console.log("layout state inits"));
    });
  }, []);

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      const modalVisible = !useEventCardStore.getState().swipeEnabled;
      if (modalVisible) return;

      if (e.deltaY > 0) {
        ref.current?.next();
      } else if (e.deltaY < 0) {
        ref.current?.prev();
      }
    };

    window.addEventListener("wheel", handleWheel);
    return () => window.removeEventListener("wheel", handleWheel);
  }, []);

  const { selectedDays } = useCalendarStore();
  const {saveAction, fetchReactions, likes} = useReactionsStore();

  const swipedAllInfoOpacity = useSharedValue(0);
  const swipedAllInfoStyle = useAnimatedStyle(() => ({
    opacity: swipedAllInfoOpacity.value,
  }));

  useEffect(() => {
    swipedAllInfoOpacity.value = withTiming(swipedAll ? 1 : 0);
  }, [swipedAll]);

  const {triggerLikeAnimation} = useEventCardStore();

  const handleEventAction = useCallback(async (action: "like" | "dislike" | "delete_mark", event: Event) => {
    saveAction({
      action,
      contentId: event.id,
      username: user.username ? user.username : user.id.toString(),
    }, () => {
      const borders = getPeriodBorders(Object.keys(selectedDays));
      fetchReactions({
        username: user.username ? user.username : user.id.toString(),
        date_start: borders.date_start, date_end: borders.date_end
      });
      if (action === "like") triggerLikeAnimation();
    });
  }, [user]);

  useEffect(() => {
    setCurrentIndex(0);
  }, [events]);

  const handleLayoutChange = useCallback(() => {
    const newLayout = layoutState === "swiper" ? "catalog" : "swiper";
    setEventCardsLayout(newLayout).then(() => setLayoutState(newLayout));
  }, [layoutState]);

  const renderCatalogItem = useCallback(({ item }: { item: Event }) => (
    <CatalogEventCard
      event={item}
      liked={!!likes?.some((event) => event.id === item.id)}
      onLike={() => handleEventAction(likes?.some((event) => event.id === item.id) ? "dislike" : "like", item)}
      onPress={() => {
        setEventSelected(item);
        setModalVisible(true);
      }}
    />
  ), [likes]);

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
                      liked={!!likes?.some((event) => event.id === item.id)}
                      onLike={() => handleEventAction("like", item)}
                      onDislike={() => handleEventAction("dislike", item)}
                      owned={!!owned}
                    />
                  </View>
                );
              }}
              containerStyle={{ zIndex: 2 }}
            />
          )}

          {!isLoading && currentIndex >= events.length - 2 && (
            <Text
              style={{
                fontFamily: "UnboundedMedium", fontSize: 12, textAlign: "center", zIndex: 1, color: "#393939",
                position: "absolute", bottom: 16, alignSelf: "center"
              }}
            >
              Контент закончился
            </Text>
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
              keyExtractor={(item) => item.id.toString()}
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
                event={selectedEvent}
                onLike={() => handleEventAction("like", selectedEvent).then(() => setModalVisible(false))}
                onDislike={() => handleEventAction("dislike", selectedEvent).then(() => setModalVisible(false))}
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
        position={"absolute"} zIndex={3}
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
                else router.replace({ pathname: "/tags/[service]", params: { service: service }});
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
            username={user.username ? user.username : user.id.toString()}
            fetchSuggestions={searchUtils.fetchSuggestions}
          />
        )}


        {layoutState === "catalog" && !allowSearch && !swipedAll && tag && (
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

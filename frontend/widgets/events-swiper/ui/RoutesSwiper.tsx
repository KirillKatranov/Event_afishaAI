import React, {useCallback, useEffect, useRef, useState} from "react";
import {
  Dimensions,
  FlatList,
  Modal,
  Pressable, Text,
  View,
} from "react-native";
import {useRouter} from "expo-router";
import {useSharedValue} from "react-native-reanimated";
import {useTheme} from "@shopify/restyle";
import {Box, LoadingCard} from "@/shared/ui";
import {Theme} from "@/shared/providers/Theme";
import Icon from "@/shared/ui/Icons/Icon";
import {getEventCardsLayout, setEventCardsLayout} from "@/shared/utils/storage/layoutSettings";
import Carousel, {ICarouselInstance} from "react-native-reanimated-carousel";
import {CatalogRouteCard, Route, RouteCard, SelectedRouteCard} from "@/features/routes";
import {BlurView} from "expo-blur";
import {LinearGradient} from "expo-linear-gradient";
import {ServicesGradients} from "@/entities/service";

interface RoutesSwiperProps {
  routes: Route[] | undefined;
  isLoading: boolean;
  containerHeight: number;
}

const width = Dimensions.get("window").width;
const height = Dimensions.get("window").height;

export const RoutesSwiper: React.FC<RoutesSwiperProps> = ({
  routes,
  isLoading,
  containerHeight,
}) => {
  const theme = useTheme<Theme>();
  const router = useRouter();

  const [showScrollToTop, setShowScrollToTop] = useState(false);
  const scrollViewRef = useRef<FlatList>(null);

  const [layoutState, setLayoutState] = useState<string | null>(null);

  const ref = React.useRef<ICarouselInstance>(null);
  const progress = useSharedValue<number>(0);

  const [selectedEvent, setEventSelected] = React.useState<Route | undefined>(undefined);
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [modalVisible, setModalVisible] = React.useState(false);

  useEffect(() => {
    getEventCardsLayout().then((state) => {
      setLayoutState(state || "catalog");
      if (!state) setEventCardsLayout("catalog").then(() => console.log("layout state inits"));
    });
  }, []);

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
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

  const scrollToTop = () => {
    scrollViewRef.current?.scrollToOffset({ offset: 0, animated: true });
  };

  const handleLayoutChange = useCallback(() => {
    const newLayout = layoutState === "swiper" ? "catalog" : "swiper";
    setEventCardsLayout(newLayout).then(() => setLayoutState(newLayout));
  }, [layoutState]);

  const renderCatalogItem = useCallback(({ item }: { item: Route }) => (
    <CatalogRouteCard
      route={item}
      onPress={() => {
        setEventSelected(item); setModalVisible(true);
      }}
    />
  ), []);

  if (!layoutState) {
    return <LoadingCard style={{ width: "100%", height: "100%" }} />;
  }

  return (
    <Box flex={1} backgroundColor="bg_color">
      {layoutState === "swiper" && (
        <>
          {!isLoading && routes && (
            <Carousel
              ref={ref}
              width={width}
              height={containerHeight}
              data={routes}
              onProgressChange={progress}
              vertical
              snapEnabled
              windowSize={3}
              loop={false}
              defaultIndex={currentIndex}
              onSnapToItem={(index) => setCurrentIndex(index)}
              renderItem={({ item }: { item: Route }) => {
                return (
                  <View style={{ height: containerHeight, width: '100%' }}>
                    <RouteCard
                      route={item}
                      onPress={() => { setEventSelected(item); setModalVisible(true) }}
                    />
                  </View>
                );
              }}
            />
          )}

          {isLoading && <LoadingCard style={{ flex: 1, height: "100%", width: "100%" }}/>}
        </>
      )}

      {layoutState === "catalog" && (
        <>
          <BlurView intensity={100} style={{ flex: 1, paddingTop: 95 }}>
            {isLoading && <LoadingCard style={{ flex: 1, height: "100%", width: "100%" }}/>}
            {!isLoading && (
              <FlatList
                ref={scrollViewRef}
                data={routes}
                renderItem={renderCatalogItem}
                keyExtractor={(item) => item.id.toString()}
                numColumns={2}
                showsVerticalScrollIndicator={false}
                onScroll={(event) => setShowScrollToTop(event.nativeEvent.contentOffset.y > 300)}
                columnWrapperStyle={{ gap: 16, marginBottom: 16 }}
                style={{
                  flex: 1,
                  gap: 16,
                  paddingHorizontal: 16,
                }}
              />
            )}
          </BlurView>

          <LinearGradient
            colors={[ServicesGradients["trips"][0], ServicesGradients["trips"][1]]}
            start={{ x: 0, y: 1 }}
            end={{ x: 1, y: 1 }}
            style={{
              position: "absolute", zIndex: -1, opacity: 0.6,
              width: height * 0.1, top: -20,
              height: height * 0.1,
              borderRadius: height * 0.1 / 2, alignSelf: "center",
              transform: [{ scaleX: width / (height * 0.1) }],
            }}
          />
        </>
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
          <SelectedRouteCard
            route={selectedEvent}
          />
        )}
      </Modal>

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

        {/* Back button */}
        <Pressable
          onPress={ () => router.replace("/tags") }
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

        {layoutState === "catalog" && (
          <View
            style={{
              flex: 1, maxHeight: 38, backgroundColor: "rgba(255,254,247,0.4)",
              alignItems: "center", justifyContent: "center", borderRadius: 16
            }}>
            <Text style={{ fontFamily: "UnboundedMedium", fontSize: 18, color: "#393939" }}>
              МАРШРУТЫ
            </Text>
          </View>
        )}

        {showScrollToTop && layoutState === "catalog" && (
          <Pressable
            style={{
              position: 'absolute',
              bottom: 30, right: 20,
              width: 40, height: 40,
              borderRadius: 25, borderWidth: 1, borderColor: "#8D8D8D", backgroundColor: "white",
              justifyContent: 'center', alignItems: 'center',
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2,},
              shadowOpacity: 0.25,
              shadowRadius: 3.84,
              elevation: 5,
            }}
            onPress={scrollToTop}
          >
            <View
              style={{
                width: '100%', height: '100%', borderRadius: 25,
                justifyContent: 'center', alignItems: 'center',
              }}
            >
              <Icon name="chevronUp" color={"#8D8D8D"} size={24} />
            </View>
          </Pressable>
        )}
      </Box>
    </Box>
  );
};

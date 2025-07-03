import React, {useCallback, useEffect, useState} from "react";
import {
  Dimensions,
  FlatList,
  Image,
  Modal,
  Pressable,
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
import {CatalogRouteCard, Route, RouteCard} from "@/features/routes";

interface RoutesSwiperProps {
  routes: Route[] | undefined;
  isLoading: boolean;
  containerHeight: number;
}

const width = Dimensions.get("window").width;

export const RoutesSwiper: React.FC<RoutesSwiperProps> = ({
  routes,
  isLoading,
  containerHeight,
}) => {
  const theme = useTheme<Theme>();
  const router = useRouter();

  const [layoutState, setLayoutState] = useState<string | null>(null);

  const ref = React.useRef<ICarouselInstance>(null);
  const progress = useSharedValue<number>(0);

  const [selectedEvent, setEventSelected] = React.useState<Route | undefined>(undefined);
  const [modalVisible, setModalVisible] = React.useState(false);
  const [currentIndex, setCurrentIndex] = React.useState(0);

  useEffect(() => {
    getEventCardsLayout().then((state) => {
      setLayoutState(state || "catalog");
      if (!state) setEventCardsLayout("catalog").then(() => console.log("layout state inits"));
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

  const handleLayoutChange = useCallback(() => {
    const newLayout = layoutState === "swiper" ? "catalog" : "swiper";
    setEventCardsLayout(newLayout).then(() => setLayoutState(newLayout));
  }, [layoutState]);

  const renderCatalogItem = useCallback(({ item }: { item: Route }) => (
    <CatalogRouteCard
      route={item}
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
              data={routes}
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
              <RouteCard
                route={selectedEvent}
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
      </Box>
    </Box>
  );
};

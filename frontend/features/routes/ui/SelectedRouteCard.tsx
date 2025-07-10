import React, {useState, useRef} from "react";
import {Image, Platform, ScrollView, Text, View, TouchableOpacity, Animated, StyleSheet, Pressable} from "react-native";
import {Route} from "@/features/routes";
import {Box, Chip, GradientText, LoadingCard} from "@/shared/ui";
import {cities, CityID} from "@/features/city-select";
import {LinearGradient} from "expo-linear-gradient";
import DropShadow from "react-native-drop-shadow";
import Icon from "@/shared/ui/Icons/Icon";
import {useConfig} from "@/shared/providers/TelegramConfig";
import {Hyperlink} from "react-native-hyperlink";
import {BlurView} from "expo-blur";
import Illustration from "@/shared/ui/Illustrations/Illustration";

interface SelectedRouteCardProps {
  route: Route;
}

const DraggableScrollView = Platform.select({
  web: () => require('@/shared/providers/DraggableScroll').DraggableScrollView,
  default: () => ScrollView,
})();

export const SelectedRouteCard: React.FC<SelectedRouteCardProps> = ({
                                                                      route
                                                                    }) => {
  const config = useConfig();
  const [imageLoading, setImageLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const [showScrollToTop, setShowScrollToTop] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);
  const itemRefs = useRef<{[key: number]: View}>({});
  const scrollY = useRef(new Animated.Value(0)).current;

  const scrollToPoint = (index: number) => {
    setActiveIndex(index);
    itemRefs.current[index]?.measureLayout(
      scrollViewRef.current?.getInnerViewNode(),
      (_x, y) => {
        scrollViewRef.current?.scrollTo({
          y: y - 20,
          animated: true
        });
      },
      () => console.warn('Failed to measure layout')
    );
  };

  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
    {
      useNativeDriver: true,
      listener: (event: any) => {
        const offsetY = event.nativeEvent.contentOffset.y;
        setShowScrollToTop(offsetY > 300);

        for (let i = 0; i < route.places.length; i++) {
          itemRefs.current[i]?.measureLayout(
            scrollViewRef.current?.getInnerViewNode(),
            (_x, y, _width, height) => {
              if (offsetY >= y - 150 && offsetY < y + height - 150) {
                setActiveIndex(i);
              }
            },
            () => {}
          );
        }
      }
    }
  );

  const scrollToTop = () => {
    scrollViewRef.current?.scrollTo({ y: 0, animated: true });
  };

  return (
    <View style={{ flex: 1 }}>
      <Animated.ScrollView
        ref={scrollViewRef}
        showsVerticalScrollIndicator={false}
        style={{ flexGrow: 1, backgroundColor: "#FAFBFF" }}
        scrollEventThrottle={16}
        onScroll={handleScroll}
      >
        <View style={{ height: 350, width: "100%" }}>
          <Image
            source={{ uri: route.photos.length > 0 ? route.photos[0].image : undefined }}
            resizeMode="cover"
            onLoadEnd={() => setImageLoading(false)}
            style={{
              flex: 1,
              display: imageLoading ? "none" : "flex"
            }}
          />

          {imageLoading && (
            <Box flex={1} alignItems={"center"} justifyContent={"center"}>
              <LoadingCard style={{ width: "100%", height: "100%", position: "absolute", zIndex: -1, borderRadius: 8 }}/>
              <Illustration name={"strelka"} width={64} height={64} opacity={0.5}/>
            </Box>
          )}

          <View style={{ position: "absolute", bottom: 20, marginRight: 20, marginLeft: 20, flexDirection: "column", gap: 4 }}>
            <Chip text={route.name} service={"trips"} size={"M"} transparent/>

            <View style={{ flexDirection: "row", gap: 8 }}>
              <Chip text={cities[route.city as CityID].name} service={"trips"} icon={"location"} transparent/>
              <Chip text={`${route.duration_km} км`} service={"trips"} icon={"route"} transparent/>
            </View>
          </View>
        </View>

        <View style={{ marginTop: 32, marginBottom: 20, flexDirection: "column", gap: 12 }}>
          <Text style={{ fontFamily: "UnboundedSemiBold", fontSize: 18, color: "#393939", paddingHorizontal: 20 }} selectable={false}>
            Точки маршрута
          </Text>

          <DraggableScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={{ paddingHorizontal: 20, gap: 5 }}
          >
            {Array.from({ length: route.places.length }, (_value, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => scrollToPoint(index)}
                activeOpacity={0.7}
              >
                <LinearGradient
                  colors={["#E600FF", "#6F01C7"]}
                  style={{
                    width: 50,
                    height: 50,
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderRadius: 5,
                    marginHorizontal: 2,
                    opacity: activeIndex === index ? 1 : 0.6
                  }}
                >
                  <Text style={{
                    fontFamily: "UnboundedSemiBold",
                    color: "white",
                    fontSize: 24
                  }} selectable={false}>
                    {index + 1}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            ))}
          </DraggableScrollView>
        </View>

        <View style={{ flexDirection: "column", gap: 30, width: "100%", paddingVertical: 20 }}>
          {route.places.map((value, index) => (
            <View
              key={index}
              ref={ref => itemRefs.current[index] = ref as View}
              style={{ flexDirection: "column", gap: 25, width: "100%"}}
            >
              <View style={{ marginLeft: 12 }}>
                <GradientText
                  id={value.id.toString()}
                  text={`• ТОЧКА ${index + 1}`}
                  fontSize={16}
                  textStyle={{ fontFamily: "UnboundedSemiBold", fontSize: 16 }}
                  textAlign={"left"}
                  colors={["#E600FF", "#6F01C7"]}
                  gradientStart={{ x: 0, y: 0 }}
                  gradientStop={{ x: 0, y: 1 }}
                />
              </View>

              <DropShadow
                style={{
                  width: "100%",
                  height: 190,
                  borderRadius: 8,
                  overflow: "hidden",
                  shadowOffset: { width: 14, height: 4},
                  shadowColor: "rgba(162,44,255,0.48)",
                  shadowRadius: 10
                }}
              >
                <Image
                  source={{ uri: route.places[index].image ? route.places[index].image : undefined }}
                  resizeMode="cover"
                  style={{ flex: 1 }}
                />
              </DropShadow>

              <View style={{ flexDirection: "column", gap: 4}}>
                <View style={{ flexDirection: "row", gap: 4, alignItems: "center", paddingHorizontal: 20}}>
                  <Icon name="location" color={"black"} size={14} />

                  <Text
                    style={{ fontFamily: "MontserratRegular", fontSize: 14, color: "black" }}
                    onPress={() => config.openLink(`https://yandex.ru/maps/?text=${route.places[index].location}`, { try_instant_view: true })}
                  >
                    {route.places[index].location}
                  </Text>
                </View>

                {route.places[index].contact && (
                  <View style={{ gap: 8 }}>
                    {route.places[index].contact!.map((con, index) => {
                      return (
                        <Hyperlink
                          key={index}
                          linkDefault={true}
                          linkStyle={{ color: "#168acd" }}
                          onPress={ () => config.openLink(Object.values(con)[0], { try_instant_view: true }) }
                          linkText={(url) => {
                            const contact = route.places[index].contact!.find((c) => Object.values(c)[0] === url);
                            return contact ? Object.keys(contact)[0] : url;
                          }}
                        >
                          <Text style={{ fontFamily: 'MontserratRegular', fontSize: 14 }}>
                            {Object.values(con)[0]}
                          </Text>
                        </Hyperlink>
                      );
                    })}
                  </View>
                )}
              </View>

              <Text style={{ fontFamily: "MontserratRegular", fontSize: 14, color: "black", paddingHorizontal: 20 }}>
                {route.places[index].description}
              </Text>
            </View>
          ))}
        </View>
      </Animated.ScrollView>

      {showScrollToTop && (
        <Pressable
          style={styles.scrollToTopButton}
          onPress={scrollToTop}
        >
          <BlurView
            style={styles.upButton}
            intensity={10}
          >
            <Icon name="chevronUp" color={"#6F01C7"} size={24} />
          </BlurView>
        </Pressable>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  scrollToTopButton: {
    position: 'absolute',
    bottom: 30, right: 20,
    width: 40, height: 40,
    borderRadius: 25,
    justifyContent: 'center', alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2,},
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  upButton: {
    width: '100%', height: '100%',
    borderRadius: 25,
    justifyContent: 'center', alignItems: 'center',
  }
});

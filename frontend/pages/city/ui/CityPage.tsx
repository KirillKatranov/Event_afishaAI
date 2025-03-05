import React, {useEffect} from "react";
import {Box, Text} from "@/shared/ui";
import {Dimensions, Image, Pressable} from "react-native";
import {CityCard, useCitySelectStore} from "@/features/city-select";
import {useConfig} from "@/shared/providers/TelegramConfig";
import {useRouter} from "expo-router";
import Carousel from "react-native-reanimated-carousel";

const window = Dimensions.get("window");

export const CityPage = () => {
  const {
    citySelected, cities,
    getCities, saveCity, onCitySelected
  } = useCitySelectStore();
  const user = useConfig().initDataUnsafe.user;
  const router = useRouter();

  useEffect(() => {
    if (!cities) getCities(user.username ? user.username : user.id.toString())
  }, [cities, getCities, user]);

  return (
    <Box
      flex={1}
      flexDirection={"column"}
      backgroundColor={"bg_color"}
      alignItems={"center"}
      style={{
        paddingTop: 60, paddingBottom: 40, gap: 50, paddingHorizontal: 40
      }}
    >
      <Box alignItems={"center"}>
        <Text color={"white"} style={{ fontFamily: "MontserratBold", fontWeight: "800", fontSize: 24 }}>{"ВЫБЕРИ"}</Text>
        <Text color={"lime"} style={{ fontFamily: "MontserratBold", fontWeight: "800", fontSize: 24 }}>{"НУЖНЫЙ ГОРОД"}</Text>
      </Box>

      {cities && (
        <Carousel
          data={cities}
          loop={true}
          pagingEnabled={true}
          snapEnabled={true}
          width={Dimensions.get("window").width * 0.9}
          height={Math.min(window.height - 328, 650)}
          onSnapToItem={(index) => onCitySelected(cities[index])}
          style={{ zIndex: 1, overflow: "visible" }}
          mode="parallax"
          modeConfig={{
            parallaxScrollingScale: 0.9,
            parallaxScrollingOffset: window.width * 0.1,
            parallaxAdjacentItemScale: 0.8
          }}
          renderItem={({item}) => <CityCard city={item}/>}
        />
      )}

      <Box
        flexDirection={"column"}
        width={"100%"}
        alignItems={"center"}
        justifyContent={"center"}
        gap={"s"}
        paddingHorizontal={"l"}
      >
        <Pressable onPress={() => saveCity(user.username ? user.username : user.id.toString())} disabled={!citySelected}>
          <Box
            width={254} height={32}
            alignItems={"center"} justifyContent={"center"}
            padding={"s"}
            borderRadius={"l"}
            backgroundColor={!citySelected ? "calendarAcceptButtonDisabled" : "calendarAcceptButton"}
          >
            <Text
              variant={"calendarAcceptButton"}
              color={"black"}
              textAlign={"center"}
              selectable={false}
            >
              {"Выбрать город"}
            </Text>
          </Box>
        </Pressable>

        <Pressable onPress={() => router.replace('/feed')}>
          <Box
            width={254} height={30}
            alignItems={"center"} justifyContent={"center"}
            padding={"s"} borderRadius={"l"}
            backgroundColor={"white"}
          >
            <Text
              variant={"calendarAcceptButton"}
              color={"black"}
              textAlign={"center"}
              selectable={false}
            >
              {"Пропустить"}
            </Text>
          </Box>
        </Pressable>
      </Box>

      <Image
        source={require("@/shared/assets/images/circles.svg")}
        resizeMode={"stretch"}
        style={{
          width: "200%", height: 350,
          position: "absolute", top: -100, zIndex: -1
        }}
      />

      <Image
        source={require("@/shared/assets/images/circles.svg")}
        resizeMode={"stretch"}
        style={{
          width: "170%", height: 200, opacity: 0.75,
          position: "absolute", bottom: -100, zIndex: -1
        }}
      />
    </Box>
  )
}

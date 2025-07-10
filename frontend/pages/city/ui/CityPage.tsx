import React, {useEffect, useState} from "react";
import {Box, LoadingCard, Text} from "@/shared/ui";
import {Dimensions, Image, Pressable} from "react-native";
import {cities, City, CityCard, CityID, useCitySelectStore} from "@/features/city-select";
import {useConfig} from "@/shared/providers/TelegramConfig";
import {useLocalSearchParams, useRouter} from "expo-router";
import Carousel from "react-native-reanimated-carousel";
import {getPeriodBorders} from "@/shared/scripts/date";
import {useCalendarStore} from "@/features/dates";
import {useFeedStore} from "@/features/content";
import {NEW_USER} from "@/shared/constants";
import {useUserStore} from "@/entities/user";

const { height, width } = Dimensions.get("window");

export const CityPage = () => {
  const { user: userParam } = useLocalSearchParams<{ user: string }>();

  const {
    citySelected, availableCities, isLoading,
    getCities, saveCity, onCitySelected
  } = useCitySelectStore();
  const { user, registerUser } = useUserStore();
  const tgUser = useConfig().initDataUnsafe.user;
  const onEvent = useConfig().onEvent;
  const router = useRouter();

  const [swiperHeight, setSwiperHeight] = useState(height);

  useEffect(() => {
    onEvent("viewportChanged", () => {
      // @ts-ignore
      setSwiperHeight(window.Telegram.WebApp.viewportHeight);
    })
  }, [setSwiperHeight, onEvent]);

  useEffect(() => {
    if (!availableCities) getCities()
  }, [availableCities, getCities, tgUser]);

  useEffect(() => {
    if (userParam == NEW_USER && user !== undefined) router.replace('/feed')
  }, [user, userParam]);

  const handleNewUser = () => {
    if (citySelected) {
      registerUser(tgUser.username ? tgUser.username : tgUser.id.toString(), citySelected)
    }
  }

  const handleOldUser = () => {
    if (citySelected) {
      saveCity(
        tgUser.username ? tgUser.username : tgUser.id.toString(),
        () => {
          const borders = getPeriodBorders(Object.keys(useCalendarStore.getState().selectedDays));
          useFeedStore.getState().fetchFeed({
            username: tgUser.username ? tgUser.username : tgUser.id.toString(),
            date_start: borders.date_start,
            date_end: borders.date_end,
          })
          router.replace('/profile');
          onCitySelected(undefined);
        }
      )
    }
  }

  const handleCitySelect = (city: CityID) => {
    onCitySelected(citySelected === city ? undefined : city);
    onCitySelected(city);
  }

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
        <Text color={"white"} style={{ fontFamily: "TDMars", fontWeight: "500", fontSize: 24 }}>{"ВЫБЕРИ"}</Text>
        <Text color={"lime"} style={{ fontFamily: "TDMars", fontWeight: "500", fontSize: 24, textAlign: "center" }}>{"НУЖНЫЙ ГОРОД"}</Text>
      </Box>

      {(isLoading || !availableCities) && (
        <LoadingCard style={{ width: Dimensions.get("window").width * 0.9, height: Math.min(swiperHeight - 328, 650), borderRadius: 25}}/>
      )}

      {availableCities && !isLoading && (
        <Carousel
          data={availableCities}
          loop={true}
          pagingEnabled={true}
          snapEnabled={true}
          width={Dimensions.get("window").width * 0.9}
          height={Math.min(swiperHeight - 328, 650)}
          style={{ zIndex: 1, overflow: "visible" }}
          mode="parallax"
          modeConfig={{
            parallaxScrollingScale: 0.9,
            parallaxScrollingOffset: width * 0.1,
            parallaxAdjacentItemScale: 0.8
          }}
          renderItem={({item}) => (
            <CityCard
              city={cities[item] as City}
              selected={citySelected === item}
              onPress={() => handleCitySelect(item)}
            />
          )}
        />
      )}

      <Box
        flexDirection={"column"}
        width={"100%"}
        gap={"s"}
        paddingHorizontal={"l"}
        style={{
          alignItems: "center", justifyContent: "center"
        }}
      >
        <Pressable
          onPress={userParam === NEW_USER ? handleNewUser : handleOldUser}
          disabled={!citySelected}
        >
          <Box
            width={254} height={32}
            alignItems={"center"} justifyContent={"center"}
            padding={"s"}
            borderRadius={"l"}
            style={{ backgroundColor: !citySelected ? "rgba(255,71,255,0.4)" : "#FF47FF"}}
          >
            <Text
              style={{ fontFamily: "MontserratBold", fontSize: 14 }}
              color={"white"}
              textAlign={"center"}
              selectable={false}
            >
              {"Выбрать город"}
            </Text>
          </Box>
        </Pressable>

        {userParam !== NEW_USER && (
          <Pressable onPress={() => {
            if (router.canGoBack()) router.back()
            else router.replace("/feed")
          }}>
            <Box
              width={254} height={30}
              alignItems={"center"} justifyContent={"center"}
              padding={"s"} borderRadius={"l"}
              backgroundColor={"white"}
            >
              <Text
                style={{ fontFamily: "MontserratBold", fontSize: 14 }}
                color={"black"}
                textAlign={"center"}
                selectable={false}
              >
                {"Пропустить"}
              </Text>
            </Box>
          </Pressable>
        )}
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

import React, {useEffect} from "react";
import {Box, Text} from "@/shared/ui";
import {Image, Pressable} from "react-native";
import {CityCard, useCitySelectStore} from "@/features/city-select";
import {useConfig} from "@/shared/providers/TelegramConfig";
import {useRouter} from "expo-router";

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

      <Box flex={1} width={"100%"} style={{ gap: 30 }}>
        {!cities && Array(2).map((_item, index) => <CityCard key={index}/>)}
        {cities && cities.map((item) => <CityCard city={item} selected={item.id === citySelected?.id} onPress={() => onCitySelected(item)}/>)}
      </Box>

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

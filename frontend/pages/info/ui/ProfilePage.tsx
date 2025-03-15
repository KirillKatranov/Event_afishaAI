import React, {useCallback, useEffect} from "react";
import {Image, Pressable} from "react-native";
import {useFocusEffect, useRouter} from "expo-router";
import {useOnboardingStore} from "@/widgets/onboarding-elements";
import {Box, Text} from "@/shared/ui";
import {useConfig} from "@/shared/providers/TelegramConfig";
import {ProfileMenu} from "@/widgets/profile-menu";
import Icon from "@/shared/ui/Icons/Icon";
import {useUserStore} from "@/entities/user";
import {cities, CityID} from "@/features/city-select";

export const ProfilePage = () => {
  const router = useRouter();
  const { initDataUnsafe } = useConfig();
  const { user, getUser } = useUserStore();
  const tgUser = useConfig().initDataUnsafe.user;

  useEffect(() => {
    if (!user) getUser(tgUser.username ? tgUser.username : tgUser.id.toString())
  }, [getUser, user]);

  useFocusEffect(
    useCallback(() => {
      useOnboardingStore.setState(() => ({ page: 1 }));
    }, [])
  )

  return (
    <Box
      flex={1}
      style={{ backgroundColor: "#FAFBFF"}}
      gap={"m"} justifyContent={"space-between"}
    >
      <Image
        source={require("@/shared/assets/images/BlurredCircles.png")}
        resizeMode="stretch"
        style={{
          position: "absolute",
          zIndex: -1,
          width: "100%",
          height: 150,
          top: -15,
          opacity: 0.75,
          alignSelf: "center"
        }}
      />

      <Pressable
        onPress={() => {
          if (router.canGoBack()) router.back()
          else router.replace("/feed")
        }}
        style={{ position: "absolute", zIndex: 1, top: 20, left: 20 }}
      >
        <Box
          width={40} height={40} backgroundColor={"cardBGColor"}
          borderRadius={"eventCard"}
          alignItems={"center"} justifyContent={"center"}
        >
          <Icon name={"chevronLeft"} color={"white"} size={24}/>
        </Box>
      </Pressable>

      <Box
        flex={1} alignItems={"center"} justifyContent={"center"}
        gap={"m"} style={{ width: "100%", margin: "auto", gap: 8 }}
      >
        <Image
          source={{ uri: initDataUnsafe.user.photo_url }}
          style={{
            width: "100%", height: "100%",
            maxWidth: 150, maxHeight: 150,
            borderRadius: 500
          }}
        />

        <Text
          variant={"cardHeader"}
          color={"black"}
          textAlign={"center"}
        >
          { initDataUnsafe.user.first_name }
        </Text>

        {initDataUnsafe.user.username && (
          <Text variant={"cardSubheader"} color={"black"} textAlign={"center"}>
            { initDataUnsafe.user.username }
          </Text>
        )}

        <Pressable onPress={() => { router.replace("/onboarding/city") }}>
          <Box
            flexDirection={"row"} alignItems={"center"}
            backgroundColor={"white"}
            style={{
              paddingHorizontal: 12, paddingVertical: 4, gap: 4,
              borderWidth: 1, borderRadius: 20, borderColor: "#B4C9FE"
            }}
          >
            <Icon name={"location"} color={"#A22CFF"} size={20}/>

            <Text variant={"profileCity"} color={"black"}>{user && user.city ? cities[user.city as CityID].name : ""}</Text>
          </Box>
        </Pressable>
      </Box>

      <ProfileMenu/>
    </Box>
  );
}

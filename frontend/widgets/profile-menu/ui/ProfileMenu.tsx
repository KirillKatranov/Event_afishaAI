import React from "react";
import {Box, Text} from "@/shared/ui";
import {Image, Pressable} from "react-native";
import {useRouter} from "expo-router";
import Icon from "@/shared/ui/Icons/Icon";
import DropShadow from "react-native-drop-shadow";
import {useTheme} from "@shopify/restyle";
import {Theme} from "@/shared/providers/Theme";

export const ProfileMenu = () => {
  const router = useRouter();
  const theme = useTheme<Theme>();

  const MenuItem = ({
    onPress, illustration, text
  }: { onPress?: () => void, illustration: any, text: string }) => (
    <Pressable onPress={onPress}>
      <Box
        height={52} width={"100%"}
        alignItems={"center"} justifyContent={"center"} flexDirection={"row"}
        style={{
          borderRadius: 8, gap: 16,
          opacity: onPress ? 1 : 0.4,
        }}
      >
        <Image source={illustration} height={36} width={36} />

        <Text selectable={false} variant={"profileMenuButton"} color={"text_color"} style={{ width: "100%" }}>
          { text }
        </Text>

        {onPress &&  <Icon name={"chevronRight"} color={"gray"} size={36}/>}
      </Box>
    </Pressable>
  )

  const Spacer = () => <Box backgroundColor={"secondary_bg_color"} style={{ width: "90%", bottom: 0, height: 2, alignSelf: "center" }}/>

  return (
    <DropShadow
      style={{
        shadowOffset: {width: 0, height: -2}, shadowColor: "rgba(188,188,188,0.25)", shadowRadius: 1,
        padding: 20, gap: 10, backgroundColor: theme.colors.bg_color, borderTopColor: theme.colors.secondary_bg_color,
        borderTopRightRadius: 24, borderTopLeftRadius: 24, borderTopWidth: 1
    }}
    >
      <MenuItem
        illustration={require("@/shared/assets/images/ticket.svg")}
        text={"Мои билеты"}
      />

      <Spacer/>

      <MenuItem
        illustration={require("@/shared/assets/images/create.svg")}
        text={"Создать мероприятие"}
      />

      <Spacer/>

      <MenuItem
        onPress={() => { router.replace("/profile/feedback") }}
        illustration={require("@/shared/assets/images/feedback.svg")}
        text={"Обратная связь"}
      />

      <Spacer/>

      <MenuItem
        onPress={() => { router.replace("/onboarding") }}
        illustration={require("@/shared/assets/images/strelka.svg")}
        text={"О нас"}
      />
    </DropShadow>
  )
}

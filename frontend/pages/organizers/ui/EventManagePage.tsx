import React from "react";
import {ScrollView, Image, Pressable, View} from "react-native";
import Icon from "@/shared/ui/Icons/Icon";
import {useRouter} from "expo-router";
import {useTheme} from "@shopify/restyle";
import {EventSettings} from "@/widgets/create-event-form";

export const EventManagePage = () => {
  const router = useRouter();
  const theme = useTheme();

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      style={{ flex: 1, backgroundColor: "white" }}
      contentContainerStyle={{
        flexGrow: 1, minHeight: '100%',
        padding: 16, gap: 16, paddingTop: 78
      }}
    >
      <Image
        source={require("@/shared/assets/images/BlurredCircles.png")}
        resizeMode="stretch"
        style={{
          position: "absolute",
          zIndex: 0,
          width: "100%",
          height: 120,
          top: -15,
          opacity: 0.75,
          alignSelf: "center"
        }}
      />

      <Pressable
        onPress={() => {
          router.replace("/tags/organizers");
        }}
        style={{ position: "absolute", zIndex: 1, top: 20, left: 20 }}
      >
        <View
          style={{ width: 40, height: 40, borderRadius: 100, alignItems: "center", justifyContent: "center" }}
        >
          <Icon name={"chevronLeft"} color={theme.colors.text_color} size={24}/>
        </View>
      </Pressable>

      <EventSettings/>
    </ScrollView>
  );
};

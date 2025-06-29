import React, {useEffect, useState} from "react";
import {Box, Text, LoadingCard} from "@/shared/ui";
import {Image, Pressable} from "react-native";
import {Event} from "@/entities/event";
import DropShadow from "react-native-drop-shadow";
import Icon from "@/shared/ui/Icons/Icon";
import {useConfig} from "@/shared/providers/TelegramConfig";
import Animated, {useAnimatedStyle, useSharedValue, withSequence, withSpring, withTiming} from "react-native-reanimated";
import Illustration from "@/shared/ui/Illustrations/Illustration";

interface CatalogEventCardProps {
  event: Event
  liked: boolean;
  onLike: () => void;
  onPress?: () => void;
}

export const CatalogEventCard: React.FC<CatalogEventCardProps> = ({
  event,
  liked,
  onLike,
  onPress
}) => {
  const [imageLoading, setImageLoading] = useState(true);
  const config = useConfig();

  const likeScale = useSharedValue(1);

  useEffect(() => {
    if (liked) {
      likeScale.value = withSequence(
        withTiming(1.4, { duration: 150 }),
        withSpring(1, { damping: 5, stiffness: 100 })
      )
    }
  }, [liked]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: likeScale.value },
    ],
  }));

  return (
    <Pressable onPress={onPress} style={{ flex: 1 }}>
      <Box width={"100%"} flexDirection={"column"} style={{ gap: 8 }}>
        <Image
          source={{ uri: event.image || undefined }}
          onLoadEnd={() => setImageLoading(false)}
          style={{
            width: "100%", height: 173,
            borderRadius: 8, borderWidth: 1, borderColor: "#DADADA",
            display: imageLoading ? "none" : "flex",
          }}
        />

        {imageLoading && (
          <Box width={"100%"} height={173} alignItems={"center"} justifyContent={"center"}>
            <LoadingCard style={{ width: "100%", height: "100%", position: "absolute", zIndex: -1, borderRadius: 8 }}/>
            <Illustration name={"strelka"} width={64} height={64}/>
          </Box>
        )}

        {event.cost != undefined && (
          <DropShadow
            style={{
              shadowColor: "rgba(64,63,63,0.25)",
              shadowRadius: 2,
              shadowOffset: { width: 2, height: 2 },
              position: "absolute", left: 4, top: 153,
              borderRadius: 12, borderWidth: 1, borderColor: "#E9E9E9", padding: 4, backgroundColor: "white",
              alignItems: "center", justifyContent: "center"
            }}
          >
            <Text style={{fontFamily: "InterRegular", fontSize: 12, color: "#A22CFF"}}>
              {event.cost != "0" ? `${event.cost} ₽` : "Бесплатно"}
            </Text>
          </DropShadow>
        )}

        <Text style={{ fontFamily: "MontserratSemiBold", fontSize: 14 }} numberOfLines={2} color={"text_color"}>
          {event.name}
        </Text>

        <Pressable
          onPress={() => {
            const link = `${process.env.EXPO_PUBLIC_WEB_APP_URL}?startapp=${event.id}`;
            const encodedMessage = encodeURIComponent(`Привет! Посмотри это мероприятие`);

            console.log("Sharing event with link:", link);

            config.openTelegramLink(`https://t.me/share/url?text=${encodedMessage}&url=${link}`);
          }}
          style={{
            position: "absolute", left: 8, top: 8,
          }}
        >
          <Box alignItems={"center"} justifyContent={"center"}>
            <Icon name={"share"} color={"#393939"} size={20}/>
          </Box>
        </Pressable>

        <Pressable
          onPress={onLike}
          style={{
            position: "absolute", right: 8, top: 8,
          }}
        >
          <Animated.View style={[animatedStyle, { alignItems: "center", justifyContent: "center"}]}>
            <Box style={{ zIndex: 2 }}><Icon name={"like"} color={"#ffffff"} size={20}/></Box>

            {liked && (
              <Box style={{ position: "absolute", zIndex: 1 }}>
                <Icon name={"likeFilled"} color={"#ff0000"} size={20}/>
              </Box>
            )}
          </Animated.View>
        </Pressable>
      </Box>
    </Pressable>
  )
}

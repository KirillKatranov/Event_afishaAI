import React, {useEffect, useState} from "react";
import {Box, Text, LoadingCard} from "@/shared/ui";
import {Image, Pressable} from "react-native";
import {Event} from "@/entities/event";
import Icon from "@/shared/ui/Icons/Icon";
import Animated, {useAnimatedStyle, useSharedValue, withSequence, withSpring, withTiming} from "react-native-reanimated";
import Illustration from "@/shared/ui/Illustrations/Illustration";
import {BlurView} from "expo-blur";
import {LikeFilled} from "@/shared/ui/Icons";
import {ServicesGradients} from "@/entities/service";

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
          <BlurView
            tint={"extraLight"} intensity={70}
            style={{
              position: "absolute", left: 8, top: 141,
              borderRadius: 12, padding: 4, backgroundColor: "rgba(255,255,255,0.04)",
              alignItems: "center", justifyContent: "center"
            }}
          >
            <Text style={{fontFamily: "MontserratRegular", fontSize: 12, color: "white"}}>
              {event.cost != "0" ? `${event.cost} ₽` : "Бесплатно"}
            </Text>
          </BlurView>
        )}

        <Text style={{ fontFamily: "MontserratSemiBold", fontSize: 14 }} numberOfLines={2} color={"text_color"}>
          {event.name}
        </Text>

        <Pressable
          onPress={onLike}
          style={{
            position: "absolute", right: 8, top: 8,
          }}
        >
          <Animated.View style={[animatedStyle, { alignItems: "center", justifyContent: "center"}]}>
            <Box style={{ position: "absolute", zIndex: 2 }}>
              <Icon name={"like"} color={event.macro_category ? ServicesGradients[event.macro_category][1] : "#c8c8c8"} size={20}/>
            </Box>

            <Box style={{ zIndex: 1 }}><Icon name={"likeFilled"} color={"rgba(255,255,255,0.5)"} size={20}/></Box>

            {liked && (
              <Box style={{ position: "absolute", zIndex: 3 }}>
                <LikeFilled width={"20"} height={"20"} fill={{
                  id: event.id.toString(),
                  startColor: event.macro_category ? ServicesGradients[event.macro_category][0] : "red",
                  endColor: event.macro_category ? ServicesGradients[event.macro_category][1] : "red",
                  start: {x: 0, y: 0},
                  end: {x: 0, y: 1}
                }}/>
              </Box>
            )}
          </Animated.View>
        </Pressable>
      </Box>
    </Pressable>
  )
}

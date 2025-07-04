import React, {useEffect, useState} from "react";
import {Image, Pressable} from "react-native";
import {Route} from "@/features/routes";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming
} from "react-native-reanimated";
import {Box, LoadingCard, Text} from "@/shared/ui";
import Illustration from "@/shared/ui/Illustrations/Illustration";
import Icon from "@/shared/ui/Icons/Icon";
import {LikeFilled} from "@/shared/ui/Icons";

interface CatalogRouteCardProps {
  route: Route;
  onPress?: () => void;
  liked?: boolean;
  onLike?: () => void;
}

export const CatalogRouteCard: React.FC<CatalogRouteCardProps> = ({
  route,
  onPress,
  liked,
  onLike
}) => {
  const [imageLoading, setImageLoading] = useState(true);

  const likeScale = useSharedValue(1);

  useEffect(() => {
    if (liked) likeScale.value = withSequence(
      withTiming(1.4, { duration: 150 }),
      withSpring(1, { damping: 5, stiffness: 100 })
    )
  }, [liked]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: likeScale.value }],
  }));

  return (
    <Pressable onPress={onPress} style={{ flex: 1 }}>
      <Box width={"100%"} flexDirection={"column"} style={{ gap: 8 }}>
        <Image
          source={{ uri: route.photos.length > 0 ? route.photos[0].image : undefined }}
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

        <Text style={{ fontFamily: "MontserratSemiBold", fontSize: 14 }} numberOfLines={2} color={"text_color"}>
          {route.name}
        </Text>

        <Pressable
          onPress={onLike}
          style={{
            position: "absolute", right: 8, top: 8,
          }}
        >
          <Animated.View style={[animatedStyle, { alignItems: "center", justifyContent: "center"}]}>
            <Box style={{ position: "absolute", zIndex: 2 }}><Icon name={"like"} color={"#8E00FF"} size={20}/></Box>
            <Box style={{ zIndex: 1 }}><Icon name={"likeFilled"} color={"rgba(255,255,255,0.5)"} size={20}/></Box>

            {liked && (
              <Box style={{ position: "absolute", zIndex: 3 }}>
                <LikeFilled width={"20"} height={"20"} fill={{
                  id: route.id.toString(),
                  startColor: "#E600FF",
                  endColor: "#7901D9",
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

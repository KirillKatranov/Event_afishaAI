import React, {useCallback, useState} from "react";
import {Image, Text, View} from "react-native";
import {Route} from "@/features/routes";
import {Box, CardControlsButton, Chip, LoadingCard} from "@/shared/ui";
import {cities, CityID} from "@/features/city-select";
import DropShadow from "react-native-drop-shadow";
import Illustration from "@/shared/ui/Illustrations/Illustration";
import {Marquee} from "@animatereactnative/marquee";
import {BlurView} from "expo-blur";
import Icon from "@/shared/ui/Icons/Icon";

interface RouteCardProps {
  route: Route;
}

export const RouteCard: React.FC<RouteCardProps> = ({
  route
}) => {
  const [imageLoading, setImageLoading] = useState(true);

  const renderTags = useCallback(
    () =>
      route.tags.map((tag) => (
        <Chip key={tag.name} text={tag.name} service={"trips"}/>
      )),
    [route.tags]
  );

  return (
    <View style={{ flex: 1, flexDirection: "column", overflow: "hidden" }}>
      <Image
        source={require("@/shared/assets/images/BlurredCircles.png")}
        resizeMode="stretch"
        style={{
          position: "absolute", alignSelf: "center",
          zIndex: -1,
          width: "100%", height: 120,
          top: 0,
          opacity: 0.75, transform: [{ scaleX: -1 }]
        }}
      />

      {/* Image */}
      <View
        style={{
          flex: 1, flexDirection: "column", justifyContent: "flex-end",
          paddingTop: 80
        }}
      >
        <Image
          source={{ uri: route.photos.length > 0 ? route.photos[0].image : undefined }}
          resizeMode="cover"
          onLoadEnd={() => setImageLoading(false)}
          style={{
            flex: 1, maxHeight: 390,
            display: imageLoading ? "none" : "flex"
          }}
        />

        {imageLoading && (
          <Box flex={1} maxHeight={390} alignItems={"center"} justifyContent={"center"}>
            <LoadingCard style={{ width: "100%", height: "100%", position: "absolute", zIndex: -1, borderRadius: 8 }}/>
            <Illustration name={"strelka"} width={64} height={64} opacity={0.5}/>
          </Box>
        )}

        <DropShadow
          style={{
            width: "100%",
            padding: 10,
            shadowOffset: {width: 0, height: 7},
            shadowColor: "rgba(0,0,0,0.25)",
            shadowRadius: 10,
          }}
        >
          <BlurView
            style={{
              position: "absolute", top: -60, right: 0, padding: 10, paddingLeft: 20,
              borderTopLeftRadius: 10,
              borderBottomLeftRadius: 10, gap: 10, flexDirection: "row", alignItems: "center"
            }}
          >
            <Text style={{ fontFamily: "UnboundedMedium", fontSize: 14, color: "white"}}>
              подробнее
            </Text>

            <Icon name={"moreGradient"} size={10} color={""}/>
          </BlurView>

          <Text style={{ fontFamily: "UnboundedMedium", fontSize: 16, textAlign: "center", color: "#393939"}}>
            {route.name.toUpperCase()}
          </Text>
        </DropShadow>
      </View>

      {/* Controls */}
      <View
        style={{
          flexDirection: "column", alignItems: "center",
          padding: 40,
        }}
      >
        <Chip text={cities[route.city as CityID].name} icon={"location"} service={"trips"}/>

        <Marquee spacing={8} speed={0.2} style={{ marginTop: 8 }}>
          <View style={{ flexDirection: "row", gap: 8 }}>
            {renderTags()}
          </View>
        </Marquee>

        <View style={{ flexDirection: "row", gap: 30, alignItems: "center" }}>
          <CardControlsButton type={"dislike"}/>
          <CardControlsButton type={"like"}/>
          <CardControlsButton type={"share"}/>
        </View>
      </View>

      <Image
        source={require("@/shared/assets/images/BlurredCircles.png")}
        resizeMode="stretch"
        style={{
          position: "absolute", alignSelf: "center",
          zIndex: -1,
          width: "100%", height: 120,
          bottom: -25,
          opacity: 0.75, transform: [{ scaleX: -1 }, { scaleY: -1 }]
        }}
      />
    </View>
  )
}

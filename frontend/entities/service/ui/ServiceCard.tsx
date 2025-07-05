import React from "react";
import {Service, ServicesGradients} from "@/entities/service/model/types/services.types";
import {Box, Text, WebLottieView} from "@/shared/ui";
import Illustration from "@/shared/ui/Illustrations/Illustration";
import {LayoutChangeEvent, Pressable} from "react-native";

interface ServiceCardProps {
  service: Service;
  onPress: () => void;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({
  service,
  onPress
}) => {
  const [startX, setStartX] = React.useState(0);
  const [boxWidth, setBoxWidth] = React.useState(280);
  const [boxHeight, setBoxHeight] = React.useState(400);

  const layoutMeasure = (e: LayoutChangeEvent) => {
    setBoxWidth(e.nativeEvent.layout.width)
    setBoxHeight(e.nativeEvent.layout.height)
  }

  return (
    <Pressable
      onPressIn={(event) => {
        event.preventDefault()
        setStartX(event.nativeEvent.pageX);
      }}
      onPressOut={(event) => {
        event.preventDefault()
        const endX = event.nativeEvent.pageX;
        if (Math.abs(endX - startX) < 15) {
          onPress();
        }
      }}
      style={{ height: "100%" }}
    >
      <Box
        flex={1}
        alignContent={"center"} justifyContent={"center"}
        gap={"m"}
        style={{
          height: "100%",
          backgroundColor: "#FFFFFF",
          borderRadius: 30,
          paddingVertical: 100,
          paddingHorizontal: 32,
          shadowColor: `${ServicesGradients[service.id][1]}65`,
          shadowOffset: { width: 2, height: 2, },
          shadowRadius: 7,
        }}
      >
        <Text style={{ fontFamily: "TDMars", fontSize: 18, fontWeight: "400", textAlign: "center", color: "#393939" }} selectable={false}>
          {service.name}
        </Text>

        {service.id == "events" && (
            <Box flex={1} justifyContent={"center"} onLayout={layoutMeasure}>
              <WebLottieView src={require("@/shared/assets/lottie/events.json")} maxHeight={boxHeight} maxWidth={boxWidth} />
            </Box>
          )}
        {service.id == "places" && (
          <Box flex={1} justifyContent={"center"} onLayout={layoutMeasure}>
            <WebLottieView src={require("@/shared/assets/lottie/places.json")} maxHeight={boxHeight} maxWidth={boxWidth}/>
          </Box>
        )}
        {service.id == "organizers" && (
          <Box flex={1} justifyContent={"center"} onLayout={layoutMeasure}>
            <WebLottieView src={require("@/shared/assets/lottie/organizers.json")} maxHeight={boxHeight} maxWidth={boxWidth}/>
          </Box>
        )}

        {(service.id == "trips") && (
          <Box flex={1} justifyContent={"center"} onLayout={layoutMeasure}>
            <Illustration name={service.illustration} width={"100%"} height={"100%"}/>
          </Box>
        )}

        <Text style={{ fontFamily: 'MontserratSemiBold', fontSize: 16, textAlign: "center", color: "#393939" }} selectable={false}>
          {service.description}
        </Text>
      </Box>
    </Pressable>
  )
}

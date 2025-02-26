import React from "react";
import {Service} from "@/entities/service/model/types/services.types";
import {Box, Text, WebLottieView} from "@/shared/ui";
import Illustration from "@/shared/ui/Illustrations/Illustration";
import {Pressable} from "react-native";

interface ServiceCardProps {
  service: Service;
  onPress: () => void;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({
  service,
  onPress
}) => {
  let startX = 0;

  return (
    <Pressable
      onPressIn={(event) => {
        startX = event.nativeEvent.pageX;
      }}
      onPressOut={(event) => {
        const endX = event.nativeEvent.pageX;
        if (Math.abs(endX - startX) < 10) {
          onPress();
        }
      }}
      style={{
        height: "100%"
      }}
    >
      <Box
        flex={1}
        alignItems={"center"} justifyContent={"center"}
        borderWidth={3}
        gap={"m"}
        style={{
          height: "100%",
          backgroundColor: service.id == "organizers" || service.id == "trips" ? "#E1E1E1" : "#F8F8F8",
          borderRadius: 30, borderColor: "#DBDFFB",
          paddingVertical: 100,
          paddingHorizontal: 32,
          shadowColor: '#4C4C4C',
          shadowOffset: {
            width: 10,
            height: 10,
          },
          shadowOpacity: 0.25,
          shadowRadius: 15,
        }}
      >
        <Text variant={"serviceName"} textAlign={"center"} color={"black"} selectable={false}>
          {service.name}
        </Text>

        {service.id == "events" && <Box width={"100%"}><WebLottieView src={require("@/shared/assets/lottie/events.json")}/></Box>}
        {service.id == "places" && <Box width={"100%"}><WebLottieView src={require("@/shared/assets/lottie/places.json")}/></Box>}
        {(service.id == "trips" || service.id == "organizers") && <Illustration name={service.illustration} width={"100%"} height={"100%"}/>}

        <Text variant={"serviceDescription"} textAlign={"center"} color={"black"} selectable={false}>
          {service.description}
        </Text>
      </Box>
    </Pressable>
  )
}

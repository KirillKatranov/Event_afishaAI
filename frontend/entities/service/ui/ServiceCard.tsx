import React from "react";
import {Service} from "@/entities/service/model/types/services.types";
import {Box, Text, WebLottieView} from "@/shared/ui";
import Illustration from "@/shared/ui/Illustrations/Illustration";

interface ServiceCardProps {
  service: Service;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({
  service
}) => {
  return (
    <Box
      flex={1}
      alignItems={"center"} justifyContent={"center"}
      borderWidth={3}
      paddingHorizontal={"m"}
      gap={"m"}
      style={{
        backgroundColor: service.id == "organizers" || service.id == "trips" ? "#E1E1E1" : "#F8F8F8",
        borderRadius: 30, borderColor: "#DBDFFB", paddingVertical: 100,
        flex: 1,
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

      {service.id == "events" && <WebLottieView src={require("@/shared/assets/lottie/events.json")}/>}
      {service.id == "places" && <WebLottieView src={require("@/shared/assets/lottie/places.json")}/>}
      {(service.id == "trips" || service.id == "organizers") && <Illustration name={service.illustration} width={"100%"} height={"100%"}/>}

      <Text variant={"serviceDescription"} textAlign={"center"} color={"black"} selectable={false}>
        {service.description}
      </Text>
    </Box>
  )
}

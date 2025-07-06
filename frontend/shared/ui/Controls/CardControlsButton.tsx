import React from "react";
import DropShadow from "react-native-drop-shadow";
import {TouchableOpacity} from "react-native";
import { ServicesGradients } from "@/entities/service";
import {DislikeGradient, LikeGradient, ShareGradient} from "@/shared/ui/Icons";

interface CardControlsButtonProps {
  type: "like" | "dislike" | "share",
  service?: "events" | "places" | "organizers" | "trips";
  onPress?: () => void;
}

export const CardControlsButton: React.FC<CardControlsButtonProps> = ({
  type,
  service,
  onPress
}) => {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
      <DropShadow
        style={{
          shadowOffset: {width: 2, height: 3},
          shadowColor: service && type == "like" ? ServicesGradients[service][1] : "rgba(0,0,0,0.25)",
          shadowRadius: 5, borderRadius: 15,
          height: type === "like" ? 71 : 52,
          width: type === "like" ? 75 : 55,
          backgroundColor: "white",
          alignItems: "center", justifyContent: "center"
        }}
      >
        {type === "like" && (
          <LikeGradient
            width={40}
            height={40}
            fill={{
              id: type+service,
              startColor: service ? ServicesGradients[service][0] : "black",
              endColor: service ? ServicesGradients[service][1] : "black",
              start: { x: 0, y: 0 },
              end: { x: 0, y: 1 }
            }}
          />
        )}

        {type === "dislike" && (
          <DislikeGradient
            width={25}
            height={25}
            fill={{
              id: type+service,
              startColor: service ? ServicesGradients[service][0] : "black",
              endColor: service ? ServicesGradients[service][1] : "black",
              start: { x: 0, y: 0 },
              end: { x: 0, y: 1 }
            }}
          />
        )}

        {type === "share" && (
          <ShareGradient
            width={25}
            height={25}
            fill={{
              id: type+service,
              startColor: service ? ServicesGradients[service][0] : "black",
              endColor: service ? ServicesGradients[service][1] : "black",
              start: { x: 0, y: 0 },
              end: { x: 0, y: 1 }
            }}
          />
        )}
      </DropShadow>
    </TouchableOpacity>
  )
}

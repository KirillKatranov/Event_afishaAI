import React from "react";
import DropShadow from "react-native-drop-shadow";
import {Pressable} from "react-native";
import Icon from "@/shared/ui/Icons/Icon";

interface CardControlsButtonProps {
  type: "like" | "dislike" | "share",
  onPress?: () => void;
}

export const CardControlsButton: React.FC<CardControlsButtonProps> = ({
  type,
  onPress
}) => {
  return (
    <Pressable onPress={onPress}>
      <DropShadow
        style={{
          shadowOffset: {width: 2, height: 3},
          shadowColor: type === "like" ? "#C421FF" : "rgba(0,0,0,0.25)",
          shadowRadius: 5, borderRadius: 15,
          height: type === "like" ? 71 : 52,
          width: type === "like" ? 75 : 55,
          backgroundColor: "white",
          alignItems: "center", justifyContent: "center"
        }}
      >
        <Icon
          name={type === "like" ? "likeGradient" : type === "dislike" ? "dislikeGradient" : "shareGradient"}
          color={"black"}
          size={ type === "like" ? 40 : type === "dislike" ? 25 : 32 }
        />
      </DropShadow>
    </Pressable>
  )
}

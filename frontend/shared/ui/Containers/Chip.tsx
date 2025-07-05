import React from "react";
import Icon, {icons} from "@/shared/ui/Icons/Icon";
import {StyleSheet, Text} from "react-native";
import {LinearGradient} from "expo-linear-gradient";
import {BlurView} from "expo-blur";
import {ServicesGradients} from "@/entities/service";

interface ChipProps {
  text: string;
  service?: "events" | "places" | "organizers" | "trips";
  icon?: keyof typeof icons
  size?: "S" | "M";
  transparent?: boolean;
}

export const Chip: React.FC<ChipProps> = ({
  text,
  service,
  icon,
  size= "S",
  transparent
}) => {
  return (
    <BlurView tint={"default"} intensity={10} style={{ borderRadius: 8 }}>
      <LinearGradient
        colors={[
          `${service ? ServicesGradients[service][0] : "rgba(0,0,0,0.5)"}` + (transparent ? "99" : ""),
          `${service ? ServicesGradients[service][1] : "rgba(0,0,0,0.5)"}` + (transparent ? "99" : "")
        ]}
        style={styles.container}
      >
        {icon && <Icon name={icon} size={size === "S" ? 16 : 20} color={"white"}/>}

        <Text style={[styles.text, { color: "white", fontSize: size === "S" ? 14 : 24 }]}>
          {text}
        </Text>
      </LinearGradient>
    </BlurView>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 6, paddingVertical: 4, gap: 4, borderRadius: 8
  },
  text: {
    fontFamily: "UnboundedMedium",
  }
})

import React from "react";
import Icon, {icons} from "@/shared/ui/Icons/Icon";
import {StyleSheet, Text} from "react-native";
import {THEME_COLORS} from "@/shared/constants";
import {LinearGradient} from "expo-linear-gradient";
import {BlurView} from "expo-blur";

interface ChipProps {
  text: string;
  service: "events" | "places" | "organizers" | "trips";
  icon?: keyof typeof icons
  size?: "S" | "M";
}

export const Chip: React.FC<ChipProps> = ({
  text,
  service,
  icon,
  size= "S",
}) => {
  const colors = THEME_COLORS[service];

  return (
    <BlurView tint={"default"} intensity={10} style={{ borderRadius: 8 }}>
      <LinearGradient
        colors={["rgba(255,0,255,0.5)", "rgba(90,13,152,0.6)"]}
        style={styles.container}
      >
        {icon && <Icon name={icon} size={size === "S" ? 16 : 20} color={colors.text}/>}

        <Text style={[styles.text, { color: colors.text, fontSize: size === "S" ? 14 : 24 }]}>
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

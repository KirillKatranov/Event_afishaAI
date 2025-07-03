import React from "react";
import Icon, {icons} from "@/shared/ui/Icons/Icon";
import {StyleSheet, Text} from "react-native";
import {THEME_COLORS} from "@/shared/constants";
import {LinearGradient} from "expo-linear-gradient";

interface ChipProps {
  text: string;
  service: "events" | "places" | "organizers" | "trips";
  icon?: keyof typeof icons
}

export const Chip: React.FC<ChipProps> = ({
  text,
  service,
  icon,
}) => {
  const colors = THEME_COLORS[service];

  return (
    <LinearGradient
      colors={["rgba(255,0,255,0.5)", "rgba(90,13,152,0.6)"]}
      style={styles.container}
    >
      {icon && <Icon name={icon} size={16} color={colors.text}/>}

      <Text style={[styles.text, { color: colors.text }]}>
        {text}
      </Text>
    </LinearGradient>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    height: 24,
    paddingHorizontal: 6, gap: 4, borderRadius: 8
  },
  text: {
    fontFamily: "UnboundedSemiBold", fontSize: 14,
  }
})

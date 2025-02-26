import React from "react";
import DropShadow from "react-native-drop-shadow";
import {Image, Pressable} from "react-native";
import {LoadingCard, Text} from "@/shared/ui";
import {City} from "@/features/city-select";
import {useTheme} from "@shopify/restyle";
import {Theme} from "@/shared/providers/Theme";

interface CityCardProps {
  city?: City;
  selected?: boolean;
  onPress?: () => void;
  isLoading?: boolean;
}

export const CityCard: React.FC<CityCardProps> = (
  props
) => {
  const theme = useTheme<Theme>();

  if (!props.city || props.isLoading) {
    return (
      <LoadingCard
        style={{ flex: 1, borderRadius: 25 }}
        loadingColors={[theme.colors.bg_color, theme.colors.secondary_bg_color]}
      />
    )
  }

  return (
    <Pressable onPress={props.onPress} style={{ flex: 1 }}>
      <DropShadow
        key={props.city.id}
        style={{
          flex: 1, backgroundColor: props.selected ? theme.colors.secondary_bg_color : theme.colors.bg_color,
          shadowOffset: {width: -1, height: 4}, shadowColor: "rgba(169,169,169,0.37)", shadowRadius: 2,
          gap: 10, paddingHorizontal: 15, paddingTop: 15, paddingBottom: 10, borderRadius: 25
        }}
      >
        <Image
          source={{ uri: props.city.image }}
          resizeMode={"cover"}
          style={{ flex: 1, borderRadius: 10 }}
        />

        <Text
          color={"text_color"} textAlign={"center"} textTransform={"uppercase"}
          style={{ fontFamily: "MontserratBold", fontSize: 20 }}
        >
          {props.city.name}
        </Text>
      </DropShadow>
    </Pressable>
  )
}

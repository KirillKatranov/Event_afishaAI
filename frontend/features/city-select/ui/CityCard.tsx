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
  const [startX, setStartX] = React.useState(0);

  if (!props.city || props.isLoading) {
    return (
      <LoadingCard
        style={{ flex: 1, borderRadius: 25 }}
        loadingColors={[theme.colors.bg_color, theme.colors.secondary_bg_color]}
      />
    )
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
          if (props.onPress) props.onPress();
        }
      }}
      style={{ flex: 1 }}
    >
      <DropShadow
        key={props.city.id}
        style={{
          flex: 1, backgroundColor: props.selected ? theme.colors.secondary_bg_color : theme.colors.bg_color,
          shadowOffset: {width: -1, height: 4}, shadowColor: "rgba(169,169,169,0.37)", shadowRadius: 2,
          gap: 10, paddingHorizontal: 15, paddingTop: 15, paddingBottom: 10, borderRadius: 25,
          borderWidth: props.selected ? 2 : 0, borderColor: theme.colors.black
        }}
      >
        <Image
          source={{ uri: props.city.image }}
          resizeMode={"cover"}
          style={{ flex: 1, borderRadius: 10 }}
        />

        <Text
          color={"black"} textAlign={"center"}
          style={{ fontFamily: "TDMars", fontWeight: "500", fontSize: 20 }}
        >
          {props.city.name.toUpperCase()}
        </Text>
      </DropShadow>
    </Pressable>
  )
}

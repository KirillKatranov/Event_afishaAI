import React from "react";
import {Pressable, Image} from "react-native";
import {Box} from "@/shared/ui/Base/Box";
import {Text} from "@/shared/ui/Base/Text";
import {formatDate} from "@/shared/scripts/date";
import { LinearGradient } from "expo-linear-gradient";
import DropShadow from "react-native-drop-shadow";
import { ServicesColors } from "@/entities/service";
import {useTheme} from "@shopify/restyle";
import {Theme} from "@/shared/providers/Theme";

interface LikedEventCardProps {
  image?: string;
  name: string;
  date: string;
  macro_category?: "events" | "places" | "organizers" | "trips";
  onPress: () => void;
}

export const LikedEventCard: React.FC<LikedEventCardProps> = ({
  image,
  name,
  date,
  macro_category,
  onPress,
}) => {
  const theme = useTheme<Theme>();

  return (
    <Pressable
      onPress={onPress}
    >
      <DropShadow
        style={{
          borderRadius: 16,
          shadowRadius: 5,
          elevation: 20,
          shadowColor: "black",
          shadowOffset: {
            height: 5,
            width: 5,
          },
          shadowOpacity: 0.25
        }}
      >
        <Box
          flex={1}
          flexDirection="row"
          minHeight={120}
          overflow="hidden"
          style={{
            borderWidth: 1,
            borderColor: "#B4C9FE",
            borderRadius: 16,
          }}
        >

          <Image
            source={{ uri: image ? image : undefined }}
            resizeMode={"cover"}
            blurRadius={10}
            style={{
              height: "100%",
              width: "40%",
              position: "absolute",
              left: 0
            }}
          />

          <Image
            source={{ uri: image ? image : undefined }}
            resizeMode={"contain"}
            style={{
              height: "100%",
              width: "40%",
            }}
          />

          <Box
            flex={1}
            flexDirection="column"
            style={{
              backgroundColor: macro_category ? ServicesColors[macro_category] : "",
              paddingHorizontal: 16, paddingVertical: 20
            }}
          >
            <Text
              variant={"reactionsCardTitle"}
              color={"text_color"}
            >
              { name }
            </Text>

            <Text
              variant={"reactionsCardSubtitle"}
              color={"subtitle_text_color"}
            >
              { formatDate(date) }
            </Text>

            <LinearGradient
              colors={[theme.colors.bg_color, `${theme.colors.bg_color}E0`, `${theme.colors.bg_color}B5`, `${theme.colors.bg_color}7F`, `${theme.colors.bg_color}00`]}
              locations={[0.53, 0.75, 0.85, 0.91, 1]}
              style={{
                position: "absolute", top: 0, right: 0, left: 0, bottom: 0, zIndex: -1
              }}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            />
          </Box>
        </Box>
      </DropShadow>
    </Pressable>
  )
}

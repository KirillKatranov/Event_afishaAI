import React, { useEffect } from "react";
import {Pressable, Image} from "react-native";
import {Box} from "@/shared/ui/Base/Box";
import {Text} from "@/shared/ui/Base/Text";
import {formatDate} from "@/shared/scripts/date";
import { LinearGradient } from "expo-linear-gradient";
import DropShadow from "react-native-drop-shadow";
import { ServicesColors } from "@/entities/service";

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
  

  return (
    <Pressable
      onPress={onPress}
    >
      
        <LinearGradient
          colors={[ 'rgba(0,0,0,0)',  macro_category ? `${ServicesColors[macro_category]}30` : "" ,macro_category ? `${ServicesColors[macro_category]}60` : "", macro_category ? `${ServicesColors[macro_category]}FF` : ""]}
          style={{
            borderRadius: 16,
          }}
          locations={[0.8, 0.9, 0.94, 1]}
          start={[0, 0]}
          end={[1, 0]}
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
                justifyContent="center"
                padding="m"
              >
                <Text
                  variant="body"
                  color="text_color"
                >
                  { name }
                </Text>

                <Text
                  variant="body"
                  color="subtitle_text_color"
                >
                  { formatDate(date) }
                </Text>
              </Box>
            </Box>
          </DropShadow>    
        </LinearGradient>
    </Pressable>
  )
}

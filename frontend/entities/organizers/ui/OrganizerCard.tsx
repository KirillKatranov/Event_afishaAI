import React, {useState} from "react"
import {Organizer} from "@/entities/organizers";
import {Image, Pressable, View} from "react-native";
import DropShadow from "react-native-drop-shadow";
import {Box, LoadingCard, Text} from "@/shared/ui";
import Illustration from "@/shared/ui/Illustrations/Illustration";

interface OrganizerCardProps {
  organizer: Organizer,
  onPress: () => void,
}

export const OrganizerCard: React.FC<OrganizerCardProps> = ({
  organizer  ,
  onPress
}) => {
  const [imageLoading, setImageLoading] = useState(true);

  return (
    <Pressable
      onPress={onPress}
    >
      <DropShadow
        style={{
          borderRadius: 16, shadowRadius: 5,
          elevation: 20,
          shadowColor: "black",
          shadowOffset: { height: 5, width: 5,}, shadowOpacity: 0.25
        }}
      >
        <View
          style={{
            flex: 1, flexDirection: "row", minHeight: 120, overflow: "hidden",
            borderWidth: 1, borderColor: "#B4C9FE", borderRadius: 16,
          }}
        >
          <Image
            source={{ uri: organizer.image ? organizer.image : undefined }}
            resizeMode={"cover"}
            blurRadius={10}
            style={{
              height: "100%", width: "40%", backgroundColor: "white",
              position: "absolute",
              left: 0
            }}
          />

          <Image
            source={{ uri: organizer.image ? organizer.image : undefined }}
            resizeMode={"contain"}
            onLoadEnd={() => setImageLoading(false)}
            style={{
              height: "100%", width: "40%", backgroundColor: "white",
              display: imageLoading ? "none" : "flex"
            }}
          />

          {imageLoading && (
            <Box width={"40%"} height={"100%"} alignItems={"center"} justifyContent={"center"}>
              <LoadingCard style={{ width: "100%", height: "100%", position: "absolute", zIndex: -1, borderRadius: 8 }}/>
              <Illustration name={"strelka"} width={64} height={64}/>
            </Box>
          )}

          <View
            style={{
              flex: 1, flexDirection: "column",
              backgroundColor: "white",
              paddingHorizontal: 16, paddingVertical: 20
            }}
          >
            <Text style={{ fontFamily: 'MontserratMedium', fontSize: 14, color: "black" }}>
              { organizer.name }
            </Text>

            {organizer.email && (
              <Text style={{ fontFamily: 'MontserratMedium', fontSize: 12, color: "black" }}>
                { organizer.email }
              </Text>
            )}
          </View>
        </View>
      </DropShadow>
    </Pressable>
  )
}

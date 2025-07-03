import React from "react";
import { LikesList } from "@/widgets/liked-events-list";
import {Image} from "react-native";
import {Box} from "@/shared/ui";

export const LikesPage = React.memo(() => {
  return (
    <Box
      flex={1}
      backgroundColor={"bg_color"}
      style={{
        paddingTop: 70,
      }}
    >
      <Image
        source={require("@/shared/assets/images/BlurredCircles.png")}
        resizeMode="stretch"
        style={{
          position: "absolute",
          zIndex: -1,
          width: "100%",
          height: 120,
          top: -15,
          opacity: 0.75,
          alignSelf: "center"
        }}
      />

      <LikesList/>
    </Box>
  );
});

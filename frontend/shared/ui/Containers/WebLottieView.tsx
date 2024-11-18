import React from "react";
import { Platform } from "react-native";
import {Box} from "@/shared/ui/Base/Box";

interface LottieViewProps {
  src: string;
}

export const WebLottieView: React.FC<LottieViewProps> = ({ src }) => {
  let LottieView: any;

  if (Platform.OS === "web") {
    LottieView = require("@lottiefiles/react-lottie-player").Player;
  } else {
    LottieView = require("lottie-react-native").default;
  }

  return (
    <Box>
      {Platform.OS === "web" ? (
        <LottieView
          autoplay
          loop
          src={src}
          style={{
            width: "100%",
            height: "100%",
          }}
        />
      ) : (
        <LottieView
          source={src}
          autoPlay
          loop
          style={{ width: 300, height: 300 }}
        />
      )}
    </Box>
  );
};

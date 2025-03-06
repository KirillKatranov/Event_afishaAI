import * as React from "react";
import Svg, {
  Path,
  Circle, LinearGradient, G, Defs, Stop, ClipPath,
} from "react-native-svg"
import {IllustrationComponentProps} from "@/shared/ui/Illustrations/IllustrationComponentProps";

export const CreateEvent: React.FC<IllustrationComponentProps> = ({width = 36, height = 36}) => (
  <Svg
    width={width}
    height={height}
    viewBox="0 0 36 37"
    fill="none"
  >
    <G clipPath="url(#clip0_2139_3480)">
      <Circle cx={18} cy={18.5} r={18} fill="#EFDCFF" />
      <Path
        d="M18 29c6.075 0 11-4.925 11-11S24.075 7 18 7m0 22c-6.075 0-11-4.925-11-11S11.925 7 18 7m0 22c2.558 0 4.632-4.925 4.632-11S20.558 7 18 7m0 22c-2.558 0-4.632-4.925-4.632-11S15.442 7 18 7M7.579 14.526H28.42zm0 6.948H28.42z"
        fill="url(#paint0_linear_2139_3480)"
      />
      <Path
        d="M18 29c6.075 0 11-4.925 11-11S24.075 7 18 7m0 22c-6.075 0-11-4.925-11-11S11.925 7 18 7m0 22c2.558 0 4.632-4.925 4.632-11S20.558 7 18 7m0 22c-2.558 0-4.632-4.925-4.632-11S15.442 7 18 7M7.579 14.526H28.42M7.58 21.474H28.42"
        stroke="#FCFCFC"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </G>
    <Defs>
      <LinearGradient
        id="paint0_linear_2139_3480"
        x1={25.9303}
        y1={6.95198}
        x2={12.6455}
        y2={26.7435}
        gradientUnits="userSpaceOnUse"
      >
        <Stop stopColor="#BF77F9" />
        <Stop offset={0.301329} stopColor="#930CFF" />
      </LinearGradient>
      <ClipPath id="clip0_2139_3480">
        <Path fill="#fff" transform="translate(0 .5)" d="M0 0H36V36H0z" />
      </ClipPath>
    </Defs>
  </Svg>
);

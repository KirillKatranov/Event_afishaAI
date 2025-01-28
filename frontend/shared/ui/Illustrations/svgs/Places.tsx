import * as React from "react";
import Svg, {
  Path,
  Defs,
  LinearGradient,
  Stop,
} from "react-native-svg"
import {IllustrationComponentProps} from "@/shared/ui/Illustrations/IllustrationComponentProps";

export const Places: React.FC<IllustrationComponentProps> = ({width = 171, height = 196}) => (
  <Svg
    width={width}
    height={height}
    viewBox="0 0 171 196"
    fill="none"
  >
    <Path
      d="M100.666 165.293c12.315-2.701 20.854-8.588 20.854-15.416 0-9.383-16.127-16.99-36.02-16.99-19.894 0-36.022 7.607-36.022 16.99 0 8.157 12.186 14.971 28.438 16.614l7.583.462m0 0l-9.804 9.787m9.804-9.787l-9.804-9.788"
      stroke="#E1F44B"
      strokeWidth={4}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M135.375 73.687c0 20.245-25.099 53.771-39.686 71.548-5.338 6.504-15.04 6.504-20.378 0-14.587-17.777-39.686-51.303-39.686-71.548 0-28.537 22.33-51.671 49.875-51.671s49.875 23.134 49.875 51.671z"
      fill="url(#paint0_linear_879_501)"
      stroke="#E1F44B"
      strokeWidth={3}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M104.029 71.806c0 10.213-8.295 18.493-18.525 18.493-10.231 0-18.526-8.28-18.526-18.493 0-10.214 8.295-18.493 18.526-18.493 10.23 0 18.525 8.28 18.525 18.493z"
      fill="#F8F8F8"
      stroke="#E1F44B"
      strokeWidth={3}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Defs>
      <LinearGradient
        id="paint0_linear_879_501"
        x1={114}
        y1={21.6413}
        x2={72.1309}
        y2={150.461}
        gradientUnits="userSpaceOnUse"
      >
        <Stop stopColor="#F4FF9C" />
        <Stop offset={0.266481} stopColor="#E1F44B" />
      </LinearGradient>
    </Defs>
  </Svg>
);

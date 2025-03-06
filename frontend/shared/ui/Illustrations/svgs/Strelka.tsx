import * as React from "react";
import Svg, {
  Path,
  Circle,
} from "react-native-svg"
import {IllustrationComponentProps} from "@/shared/ui/Illustrations/IllustrationComponentProps";

export const Strelka: React.FC<IllustrationComponentProps> = ({width = 36, height = 36}) => (
  <Svg
    width={width}
    height={height}
    viewBox="0 0 36 37"
    fill="none"
  >
    <Path
      d="M34.49 18.39c0 8.892-7.21 16.1-16.102 16.1s-16.1-7.208-16.1-16.1c0-8.893 7.208-16.102 16.1-16.102 8.893 0 16.101 7.209 16.101 16.101z"
      fill="#E1F44B"
      stroke="#393939"
      strokeWidth={0.198}
    />
    <Path
      d="M25.423 7.781a.792.792 0 011.09.759l-.58 18.185a.792.792 0 01-1.245.625l-1.62-1.128-12.9-8.975-1.747-1.215a.792.792 0 01.154-1.383L25.423 7.78z"
      fill="#393939"
    />
    <Path
      d="M5.958 28.513a.396.396 0 01-.013-.456l6.363-9.62 9.249 6.435-6.947 9.307-1.167-.49-1.803-.45-2.247-1.35-2.253-1.8-1.182-1.576z"
      fill="#393939"
    />
    <Circle
      cx={18.3895}
      cy={18.3895}
      r={16.29}
      stroke="#393939"
      strokeWidth={0.18}
    />
  </Svg>
);

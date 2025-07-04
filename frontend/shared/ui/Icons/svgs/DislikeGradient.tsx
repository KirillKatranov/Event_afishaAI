import * as React from "react";
import Svg, {Defs, LinearGradient, Path, Rect, Stop} from "react-native-svg";
import {IconComponentProps} from "@/shared/ui/Icons/IconComponentProps";

const DislikeGradient: React.FC<IconComponentProps> = ({width = 25, height = 25}) => (
  <Svg
    width={width}
    height={height}
    viewBox="0 0 25 25"
    fill="none"
  >
    <Path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M18.917 0a4.167 4.167 0 014.09 3.375l1.915 9.895a4.255 4.255 0 01-4.178 5.064h-7.727l.535 2.679A3.333 3.333 0 0110.284 25H9.167a.833.833 0 01-.754-.479l-3.054-6.49c-.355.193-.76.302-1.192.302H2.5a2.5 2.5 0 01-2.5-2.5V2.5A2.5 2.5 0 012.5 0h1.667c.64 0 1.224.24 1.666.637A2.49 2.49 0 017.5 0h11.417zM3 1.5l-1.5.167c0 .46.147 12.502.157 13.385l.06.819V16l.783.667c-.38-.246-.782-.483-.782-.796L1.499 1.948c0-.46.54-.281 1.001-.281h1.667C2.5 2 3 1.04 3 1.5zm3.667 1c0-.46.373-.833.833-.833h11.417a2.5 2.5 0 012.454 2.025l1.915 9.894a2.589 2.589 0 01-2.541 3.08H12a.833.833 0 00-.817.997l.735 3.677a1.667 1.667 0 01-1.634 1.993h-.589l-2.949-6.267a.833.833 0 01-.08-.355V2.5z"
      fill="url(#paint0_linear_2313_5605)"
    />
    <Rect
      x={1}
      width={5}
      height={17}
      rx={2.5}
      fill="url(#paint1_linear_2313_5605)"
    />
    <Defs>
      <LinearGradient
        id="paint0_linear_2313_5605"
        x1={51.8844}
        y1={-12.1242}
        x2={48.9609}
        y2={28.0963}
        gradientUnits="userSpaceOnUse"
      >
        <Stop stopColor="#F0F" />
        <Stop offset={0.206731} stopColor="#E600FF" />
        <Stop offset={0.663462} stopColor="#8E00FF" />
        <Stop offset={1} stopColor="#6F01C7" />
      </LinearGradient>
      <LinearGradient
        id="paint1_linear_2313_5605"
        x1={-4.37689}
        y1={-8.24444}
        x2={2.02698}
        y2={17.6673}
        gradientUnits="userSpaceOnUse"
      >
        <Stop stopColor="#F0F" />
        <Stop offset={0.206731} stopColor="#E600FF" />
        <Stop offset={0.663462} stopColor="#8E00FF" />
        <Stop offset={1} stopColor="#6F01C7" />
      </LinearGradient>
    </Defs>
  </Svg>
);

export default DislikeGradient;

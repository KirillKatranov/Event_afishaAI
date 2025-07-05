import * as React from "react";
import Svg, {ClipPath, Defs, LinearGradient, Path, Stop} from "react-native-svg";
import {IconComponentProps} from "@/shared/ui/Icons/IconComponentProps";

const ShareGradient: React.FC<IconComponentProps> = ({width = 33, height = 33}) => (
  <Svg
    width={width}
    height={height}
    viewBox="0 0 33 33"
    fill="none"
  >
    <Path
      data-figma-bg-blur-radius={20.9}
      d="M7.5 13h2.773v1H8v13h17V14h-2.273v-1H25.5a.5.5 0 01.5.5v14a.5.5 0 01-.5.5h-18a.5.5 0 01-.5-.5v-14a.5.5 0 01.5-.5zm8.89-7.4a.5.5 0 01.354.146l3.397 3.396-.708.707-1.58-1.579L17 7.417V17h-1V7.198l-2.652 2.652-.707-.707 3.396-3.396a.501.501 0 01.354-.147z"
      stroke="url(#paint0_linear_2313_5611)"
    />
    <Defs>
      <ClipPath
        id="bgblur_0_2313_5611_clip_path"
      >
        <Path d="M7.5 13h2.773v1H8v13h17V14h-2.273v-1H25.5a.5.5 0 01.5.5v14a.5.5 0 01-.5.5h-18a.5.5 0 01-.5-.5v-14a.5.5 0 01.5-.5zm8.89-7.4a.5.5 0 01.354.146l3.397 3.396-.708.707-1.58-1.579L17 7.417V17h-1V7.198l-2.652 2.652-.707-.707 3.396-3.396a.501.501 0 01.354-.147z" />
      </ClipPath>
      <LinearGradient
        id="paint0_linear_2313_5611"
        x1={-15.0075}
        y1={-6.24949}
        x2={-11.8119}
        y2={31.3253}
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

export default ShareGradient;

import * as React from "react";
import Svg, {ClipPath, Defs, G, LinearGradient, Mask, Path, Stop} from "react-native-svg";
import {IconComponentProps} from "@/shared/ui/Icons/IconComponentProps";

const MoreGradient: React.FC<IconComponentProps> = ({width = 10, height = 10}) => (
  <Svg
    width={width}
    height={height}
    viewBox="0 0 10 10"
    fill="none"
  >
    <G clipPath="url(#clip0_2313_5578)">
      <Mask id="a" fill="#fff">
        <Path d="M4.595 0l-.353.353L8.89 5 4.242 9.647l.352.353 5-5-4.999-5z" />
      </Mask>
      <Path
        d="M4.595 0L6.01-1.414 4.596-2.829 3.18-1.414 4.595 0zm-.353.353L2.828-1.06 1.414.353l1.414 1.414L4.242.353zM8.89 5l1.414 1.414L11.717 5l-1.414-1.414L8.89 5zM4.242 9.647L2.828 8.233l-1.411 1.41 1.408 1.415 1.417-1.411zm.352.353l-1.418 1.411 1.415 1.42 1.417-1.417L4.594 10zm5-5l1.414 1.414L12.422 5l-1.414-1.414L9.594 5zM4.595 0L3.181-1.414l-.353.353L4.242.353l1.414 1.414.354-.353L4.595 0zm-.353.353L2.828 1.767l4.647 4.647L8.889 5l1.414-1.414-4.647-4.647L4.242.353zM8.89 5L7.475 3.586 2.828 8.233l1.414 1.414 1.414 1.414 4.647-4.647L8.89 5zM4.242 9.647l-1.417 1.411.351.353L4.594 10 6.01 8.589l-.351-.353-1.418 1.41zm.352.353l1.414 1.414 5-5L9.594 5 8.18 3.586l-5 5L4.594 10zm5-5l1.414-1.414-4.998-5L4.595 0 3.181 1.414l4.998 5L9.594 5z"
        fill="url(#paint0_linear_2313_5578)"
        mask="url(#a)"
      />
      <Mask id="b" fill="#fff">
        <Path d="M.758 10l5-5L.759 0 .406.353 5.053 5 .406 9.647.758 10z" />
      </Mask>
      <Path
        d="M.758 10L-.66 11.411l1.415 1.42 1.417-1.417L.758 10zm5-5l1.414 1.414L8.586 5 7.172 3.586 5.758 5zM.759 0l1.415-1.414L.76-2.829-.655-1.414.76 0zM.406.353L-1.008-1.06-2.422.353l1.414 1.414L.406.353zM5.053 5l1.414 1.414L7.882 5 6.467 3.586 5.053 5zM.406 9.647l-1.414-1.414-1.411 1.41 1.408 1.415L.406 9.647zM.758 10l1.414 1.414 5-5L5.758 5 4.344 3.586l-5 5L.758 10zm5-5l1.414-1.414-4.998-5L.759 0-.655 1.414l4.998 5L5.758 5zM.759 0L-.655-1.414l-.353.353L.406.353 1.82 1.767l.354-.353L.759 0zM.406.353l-1.414 1.414 4.647 4.647L5.053 5l1.414-1.414L1.82-1.061.406.353zM5.053 5L3.64 3.586l-4.647 4.647L.406 9.647 1.82 11.06l4.647-4.647L5.053 5zM.406 9.647l-1.417 1.411.351.353L.758 10l1.417-1.411-.351-.353-1.418 1.41z"
        fill="url(#paint1_linear_2313_5578)"
        mask="url(#b)"
      />
    </G>
    <Defs>
      <LinearGradient
        id="paint0_linear_2313_5578"
        x1={3.35418}
        y1={5.00001}
        x2={10.04}
        y2={5.42761}
        gradientUnits="userSpaceOnUse"
      >
        <Stop offset={0.107372} stopColor="#E1F44B" />
        <Stop offset={0.453526} stopColor="#E600FF" />
        <Stop offset={1} stopColor="#8E00FF" />
      </LinearGradient>
      <LinearGradient
        id="paint1_linear_2313_5578"
        x1={-0.481753}
        y1={5.00001}
        x2={6.20404}
        y2={5.42761}
        gradientUnits="userSpaceOnUse"
      >
        <Stop offset={0.107372} stopColor="#E1F44B" />
        <Stop offset={0.453526} stopColor="#E600FF" />
        <Stop offset={1} stopColor="#8E00FF" />
      </LinearGradient>
      <ClipPath id="clip0_2313_5578">
        <Path fill="#fff" d="M0 0H10V10H0z" />
      </ClipPath>
    </Defs>
  </Svg>
);

export default MoreGradient;

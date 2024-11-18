import * as React from "react";
import Svg, {Path} from "react-native-svg";
import {IllustrationComponentProps} from "@/shared/ui/Illustrations/IllustrationComponentProps";

export const BottomLine: React.FC<IllustrationComponentProps> = ({width = 393, height = 123}) => (
  <Svg
    width={width}
    height={height}
    preserveAspectRatio="none"
    viewBox="0 0 393 123"
    fill="none"
  >
    <Path
      d="M0 5.023C15.237 9.627 26.884 30.725 37.347 42.64c14.613 16.64 31.058 35.55 49.23 47.228 33.09 21.263 161.27 59.713 161.27-23.823 0-38.958-58.208-4.598-23.578-4.598 55.301 0 110.755-3.761 166.174-3.761"
      stroke="#B4C9FE"
      strokeWidth={10}
      strokeLinecap="round"
    />
  </Svg>
);

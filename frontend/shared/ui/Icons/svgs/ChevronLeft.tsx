import * as React from "react";
import Svg, {Path} from "react-native-svg";
import {IconComponentProps} from "@/shared/ui/Icons/IconComponentProps";

const ChevronLeft: React.FC<IconComponentProps> = ({width = 24, height = 24, fill = 'black'}) => (
  <Svg
    width={width}
    height={height}
    viewBox="0 0 25 24"
    fill="none"
  >
    <Path
      d="M15.506 16.58L10.926 12l4.58-4.59L14.096 6l-6 6 6 6 1.41-1.42z"
      fill={fill}
    />
  </Svg>
);

export default ChevronLeft;

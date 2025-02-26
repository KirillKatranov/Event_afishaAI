import * as React from "react";
import Svg, {Path} from "react-native-svg";
import {IconComponentProps} from "@/shared/ui/Icons/IconComponentProps";

const ChevronRight: React.FC<IconComponentProps> = ({width = 24, height = 24, fill = 'black'}) => (
  <Svg
    width={width}
    height={height}
    viewBox="0 0 24 24"
    fill="none"
  >
    <Path
      d="M8.59 16.58L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.42z"
      fill={fill}
    />
  </Svg>
);

export default ChevronRight;

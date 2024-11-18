import * as React from "react";
import Svg, {Path} from "react-native-svg";
import {IconComponentProps} from "@/shared/ui/Icons/IconComponentProps";

const Tags: React.FC<IconComponentProps> = ({width = 24, height = 24, fill = 'black'}) => (
  <Svg
    width={width}
    height={height}
    viewBox="0 0 25 24"
    fill="none"
  >
    <Path
      d="M5.844 7h14M5.844 12h10M5.844 17h6"
      stroke={fill}
      strokeLinecap="round"
    />
  </Svg>
);

export default Tags;

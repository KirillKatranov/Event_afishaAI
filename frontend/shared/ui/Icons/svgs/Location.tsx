import * as React from "react";
import Svg, {Circle, Path} from "react-native-svg";
import {IconComponentProps} from "@/shared/ui/Icons/IconComponentProps";

const Location: React.FC<IconComponentProps> = ({width = 24, height = 24, fill = 'black'}) => (
  <Svg
    width={width}
    height={height}
    viewBox="0 0 12 13"
    fill="none"
  >
    <Path
      d="M10.963 5.833c0 3.21-3.368 5.417-4.575 6.105a.85.85 0 01-.85 0C4.33 11.25.963 9.043.963 5.833c0-3 2.423-5 5-5 2.667 0 5 2 5 5z"
      stroke={fill}
      strokeWidth={0.5}
    />
    <Circle
      cx={5.96354}
      cy={5.73063}
      r={1.41667}
      stroke={fill}
      strokeWidth={0.5}
    />
  </Svg>
);

export default Location;

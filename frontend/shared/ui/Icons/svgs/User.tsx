import * as React from "react";
import Svg, {Circle, Path} from "react-native-svg";
import {IconComponentProps} from "@/shared/ui/Icons/IconComponentProps";

const User: React.FC<IconComponentProps> = ({width = 24, height = 24, fill = 'black'}) => (
  <Svg
    width={width}
    height={height}
    viewBox="0 0 25 24"
    fill="none"
  >
    <Circle cx={12.5312} cy={8} r={4} fill={fill} />
    <Path
      d="M5.87 17.32C6.53 14.528 9.302 13 12.173 13h.715c2.87 0 5.643 1.527 6.304 4.32.128.541.23 1.107.287 1.682.055.55-.396.998-.949.998h-12c-.552 0-1.003-.449-.949-.998.058-.575.16-1.14.287-1.681z"
      fill={fill}
    />
  </Svg>
);

export default User;

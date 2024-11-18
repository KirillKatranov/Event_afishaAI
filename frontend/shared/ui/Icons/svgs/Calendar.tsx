import * as React from "react";
import Svg, {Path, Rect} from "react-native-svg";
import {IconComponentProps} from "@/shared/ui/Icons/IconComponentProps";

const Calendar: React.FC<IconComponentProps> = ({width = 24, height = 24, fill = 'black'}) => (
  <Svg
    width={width}
    height={height}
    viewBox="0 0 17 17"
    fill="none"
  >
    <Rect
      x={2.98242}
      y={4.5}
      width={12}
      height={10}
      rx={2}
      stroke={fill}
    />
    <Path d="M3.649 7.833h10.667" stroke={fill} strokeLinecap="round" />
    <Path
      d="M6.982 11.166h4"
      stroke={fill}
      strokeWidth={2}
      strokeLinecap="round"
    />
    <Path
      d="M6.316 2.5v2.667M11.649 2.5v2.667"
      stroke={fill}
      strokeLinecap="round"
    />
  </Svg>
);

export default Calendar;

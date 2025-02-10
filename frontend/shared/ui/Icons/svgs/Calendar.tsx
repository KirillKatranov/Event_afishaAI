import * as React from "react";
import Svg, {Path, Rect} from "react-native-svg";
import {IconComponentProps} from "@/shared/ui/Icons/IconComponentProps";

const Calendar: React.FC<IconComponentProps> = ({width = 24, height = 24, fill = 'black'}) => (
  <Svg
      width={width}
      height={height}
      viewBox="0 0 24 24"
      fill="none"
    >
      <Rect x={3} y={6} width={18} height={15} rx={2} stroke={fill} />
      <Path
        d="M3 10c0-1.886 0-2.828.586-3.414C4.172 6 5.114 6 7 6h10c1.886 0 2.828 0 3.414.586C21 7.172 21 8.114 21 10H3z"
        fill={fill}
      />
      <Path d="M7 3v3M17 3v3" stroke={fill} strokeLinecap="round" />
      <Rect x={7} y={12} width={4} height={2} rx={0.5} fill={fill} />
      <Rect x={7} y={16} width={4} height={2} rx={0.5} fill={fill} />
      <Rect x={13} y={12} width={4} height={2} rx={0.5} fill={fill} />
      <Rect x={13} y={16} width={4} height={2} rx={0.5} fill={fill} />
    </Svg>
);

export default Calendar;

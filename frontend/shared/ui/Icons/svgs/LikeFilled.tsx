import * as React from "react";
import Svg, {Path} from "react-native-svg";
import {IconComponentProps} from "@/shared/ui/Icons/IconComponentProps";

const LikeFilled: React.FC<IconComponentProps> = ({width = 25, height = 24, fill = 'black'}) => (
  <Svg
    width={width}
    height={height}
    viewBox="0 0 25 24"
  >
    <Path
      d="M4.95 13.908l6.953 6.531c.24.225.36.338.5.366a.5.5 0 00.193 0c.142-.028.261-.14.5-.366l6.953-6.53a5.203 5.203 0 00.549-6.983l-.31-.399c-1.968-2.536-5.918-2.111-7.301.787a.54.54 0 01-.974 0C10.63 4.416 6.68 3.99 4.712 6.527l-.31.4a5.203 5.203 0 00.549 6.981z"
      fill={fill}
    />
  </Svg>
);

export default LikeFilled;

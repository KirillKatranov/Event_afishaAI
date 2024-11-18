import * as React from "react";
import Svg, {Path} from "react-native-svg";
import {IconComponentProps} from "@/shared/ui/Icons/IconComponentProps";

const LikeFilled: React.FC<IconComponentProps> = ({width = 24, height = 24, fill = 'black'}) => (
  <Svg
    width={width}
    height={height}
    viewBox="0 0 24 24"
    fill="none"
  >
    <Path
      d="M16.5 2.825c-1.74 0-3.41.81-4.5 2.08-1.09-1.27-2.76-2.08-4.5-2.08-3.08 0-5.5 2.41-5.5 5.5 0 3.77 3.4 6.86 8.55 11.53l1.45 1.32 1.45-1.32c5.15-4.67 8.55-7.76 8.55-11.53 0-3.09-2.42-5.5-5.5-5.5z"
      fill={fill}
    />
  </Svg>
);

export default LikeFilled;

import * as React from "react";
import Svg, {Path} from "react-native-svg";
import {IconComponentProps} from "@/shared/ui/Icons/IconComponentProps";

const Back: React.FC<IconComponentProps> = ({width = 24, height = 24, fill = 'black'}) => (
  <Svg
    width={width}
    height={height}
    viewBox="0 0 25 25"
    fill="none"
  >
    <Path
      d="M4.332 8.5l-.707.707-.707-.707.707-.707.707.707zm5 12a1 1 0 110-2v2zm-.707-6.293l-5-5 1.414-1.414 5 5-1.414 1.414zm-5-6.414l5-5 1.414 1.414-5 5-1.414-1.414zm.707-.293h10.5v2h-10.5v-2zm10.5 13h-5.5v-2h5.5v2zm6.5-6.5a6.5 6.5 0 01-6.5 6.5v-2a4.5 4.5 0 004.5-4.5h2zm-6.5-6.5a6.5 6.5 0 016.5 6.5h-2a4.5 4.5 0 00-4.5-4.5v-2z"
      fill={fill}
    />
  </Svg>
);

export default Back;

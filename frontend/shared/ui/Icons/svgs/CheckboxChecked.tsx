import React from "react";
import {IconComponentProps} from "../IconComponentProps";
import Svg, {Path} from "react-native-svg";

const CheckboxChecked: React.FC<IconComponentProps> = ({ width = 24, height = 24, fill= 'black'}) => {
  return (
    <Svg
      width={width}
      height={height}
      viewBox="0 0 24 24"
      fill="none"
    >
      <Path
        d="M18 3a3 3 0 013 3v12a3 3 0 01-3 3H6a3 3 0 01-3-3V6a3 3 0 013-3h12zm-1.53 4.97L10 14.44l-2.47-2.47a.75.75 0 00-1.06 1.06l3 3a.75.75 0 001.06 0l7-7a.75.75 0 00-1.06-1.06z"
        fill={fill as string}
      />
    </Svg>
  )
}

export default CheckboxChecked

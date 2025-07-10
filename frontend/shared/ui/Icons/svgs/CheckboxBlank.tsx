import React from "react";
import {IconComponentProps} from "../IconComponentProps";
import Svg, {Path} from "react-native-svg";

const CheckboxBlank: React.FC<IconComponentProps> = ({ width = 24, height = 24, fill= 'black'}) => {
  return (
    <Svg
      width={width}
      height={height}
      viewBox="0 0 24 24"
      fill="none"
    >
      <Path
        d="M5.75 3h12.5A2.75 2.75 0 0121 5.75v12.5A2.75 2.75 0 0118.25 21H5.75A2.75 2.75 0 013 18.25V5.75A2.75 2.75 0 015.75 3zm0 1.5c-.69 0-1.25.56-1.25 1.25v12.5c0 .69.56 1.25 1.25 1.25h12.5c.69 0 1.25-.56 1.25-1.25V5.75c0-.69-.56-1.25-1.25-1.25H5.75z"
        fill={fill as string}
      />
    </Svg>
  )
}

export default CheckboxBlank;

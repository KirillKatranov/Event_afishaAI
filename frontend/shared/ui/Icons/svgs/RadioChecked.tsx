import React from "react";
import {IconComponentProps} from "../IconComponentProps";
import Svg, {Path} from "react-native-svg";

const RadioChecked: React.FC<IconComponentProps> =({ width = 24, height = 24, fill= 'black'}) => {
  return (
    <Svg
      width={width}
      height={height}
      viewBox="0 0 24 24"
      fill="none"
    >
      <Path
        d="M12 20a8 8 0 110-16 8 8 0 010 16zm0-18a10 10 0 100 20 10 10 0 000-20zm0 5a5 5 0 100 10 5 5 0 000-10z"
        fill={fill as string}
      />
    </Svg>
  )
}

export default RadioChecked;

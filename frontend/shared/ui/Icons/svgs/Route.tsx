import React from "react";
import {IconComponentProps} from "../IconComponentProps";
import Svg, {Path} from "react-native-svg";

const Route: React.FC<IconComponentProps> =({ width = 16, height = 16, fill= 'black'}) => {
  return (
    <Svg
      width={width}
      height={height}
      viewBox="0 0 16 16"
      fill="none"
    >
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M7.529.862A.667.667 0 018.21.7l4 1.333a.666.666 0 01.26 1.104L11.61 4l1.861 1.862a3.024 3.024 0 01-4.276 4.276L6.03 6.971a1.926 1.926 0 00-2.724 2.724l1.833 1.833a2 2 0 11-.943.943l-1.833-1.833a3.26 3.26 0 014.61-4.61l3.166 3.167a1.69 1.69 0 102.39-2.39l-1.861-1.862-.862.862a.667.667 0 01-1.104-.26l-1.333-4a.667.667 0 01.16-.683zm1.525 1.525l.57 1.712 1.142-1.141-1.712-.57zM6 12.667A.667.667 0 106 14a.667.667 0 000-1.333z"
        fill={fill as string}
      />
    </Svg>
  )
}

export default Route;

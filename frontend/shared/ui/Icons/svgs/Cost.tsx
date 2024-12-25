import * as React from "react"
import Svg, { Path } from "react-native-svg"
import {IconComponentProps} from "@/shared/ui/Icons/IconComponentProps";

const Cost: React.FC<IconComponentProps> = ({width = 24, height = 24, fill = 'black'}) => (
  <Svg
    width={width}
    height={height}
    viewBox="0 0 16 16"
    fill="none"
  >
    <Path
      d="M4.55 13.182V3h3.44c.8 0 1.452.144 1.96.433.51.285.888.67 1.133 1.158.245.487.368 1.03.368 1.63 0 .6-.123 1.146-.368 1.636-.242.49-.617.882-1.124 1.174-.507.288-1.156.432-1.949.432H4V8.37h3.97c.548 0 .987-.094 1.318-.283a1.69 1.69 0 00.721-.766c.152-.325.229-.69.229-1.098 0-.408-.076-.773-.229-1.094a1.632 1.632 0 00-.726-.756c-.335-.185-.779-.278-1.332-.278H5.783v9.088H4.55z"
      fill={fill}
    />
    <Path
      stroke={fill}
      strokeWidth={0.7}
      d="M4.02246 10.4091L9.02246 10.4091"
    />
  </Svg>
);

export default Cost;

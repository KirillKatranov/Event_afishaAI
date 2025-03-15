import * as React from "react";
import Svg, {Path} from "react-native-svg";
import {IconComponentProps} from "@/shared/ui/Icons/IconComponentProps";

const Catalog: React.FC<IconComponentProps> = ({width = 24, height = 24, fill = 'black'}) => (
  <Svg
    width={width}
    height={height}
    viewBox="0 0 24 24"
  >
    <Path
      d="M3 11h8V3H3m2 2h4v4H5m8 12h8v-8h-8m2 2h4v4h-4M3 21h8v-8H3m2 2h4v4H5m8-16v8h8V3m-2 6h-4V5h4z"
      fill={fill}
    />
  </Svg>
);

export default Catalog;

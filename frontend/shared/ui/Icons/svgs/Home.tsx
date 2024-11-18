import * as React from "react";
import Svg, {Path} from "react-native-svg";
import {IconComponentProps} from "@/shared/ui/Icons/IconComponentProps";

const Home: React.FC<IconComponentProps> = ({width = 24, height = 24, fill = 'black'}) => (
  <Svg
    width={width}
    height={height}
    viewBox="0 0 24 24"
    fill="none"
  >
    <Path
      d="M4.999 13.173c0-1.358 0-2.037.274-2.634.275-.596.79-1.038 1.821-1.922l1-.857C9.958 6.163 10.89 5.364 12 5.364c1.11 0 2.041.799 3.905 2.396l1 .857c1.03.884 1.546 1.326 1.82 1.922.275.597.275 1.276.275 2.634v4.24c0 1.886 0 2.828-.586 3.414-.586.586-1.528.586-3.414.586h-.996v-6.027H10.11l-.121 6.027h-.989c-1.886 0-2.828 0-3.414-.586-.586-.586-.586-1.528-.586-3.414v-4.24z"
      fill={fill}
    />
  </Svg>
);

export default Home;

import * as React from "react";
import Svg, {Path} from "react-native-svg";
import {IllustrationComponentProps} from "@/shared/ui/Illustrations/IllustrationComponentProps";

export const TopLine: React.FC<IllustrationComponentProps> = ({width = 393, height = 393}) => (
  <Svg
    width={width}
    height={height}
    preserveAspectRatio="none"
    viewBox="0 0 393 349"
    fill="none"
  >
    <Path
      d="M-11.306 5.438c42.849.84 83.69 10.98 108.91 48.81 14.158 21.236 17.886 47.273 20.215 72.12 1.82 19.407 6.281 47.2-4.188 65.2-12.443 21.393-64.353 37.71-65.929 1.457-.89-20.482 18.173-27.751 34.24-36.789 25.548-14.371 54.555-20.978 83.229-25.679 26.54-4.351 57.185-10.368 83.959-4.189 46.95 10.835 48.547 49.358 52.816 90.333 3.79 36.387 6.208 82.5 34.239 110.002 16.132 15.828 44.591 15.158 65.564 16.391"
      stroke="#B4C9FE"
      strokeWidth={10}
      strokeLinecap="round"
    />
  </Svg>
);

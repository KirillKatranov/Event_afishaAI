import * as React from "react";
import Svg, {
  Path,
  Defs,
  LinearGradient,
  Stop,
} from "react-native-svg"
import {IllustrationComponentProps} from "@/shared/ui/Illustrations/IllustrationComponentProps";

export const Organizers: React.FC<IllustrationComponentProps> = ({width = 122, height = 187}) => (
  <Svg
    width={width}
    height={height}
    viewBox="0 0 122 187"
    fill="none"
  >
    <Path
      d="M3.625 155.41h22.889c4.775 0 6.654-2.611 7.58-6.235l7.742-30.281c.748-2.924 6.162-2.904 6.873.025l11.279 46.423c.706 2.908 6.066 2.957 6.863.063l6.73-24.455c.728-2.645 5.469-2.921 6.7-.389l4.782 9.836c1.466 3.016 5.195 5.013 9.36 5.013h23.484"
      stroke="#6361DD"
      strokeWidth={3}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M83.475 20.31c-8.486 0-13.818 4.217-16.865 7.921-1.435 1.745-5.31 1.745-6.745 0-3.047-3.705-8.378-7.92-16.866-7.92-15.133 0-24.249 14.402-24.249 26.27 0 15.546 27.17 37.46 39.043 46.294a9.087 9.087 0 0010.889 0c11.873-8.832 39.042-30.74 39.042-46.29 0-11.872-9.11-26.275-24.249-26.275z"
      fill="url(#paint0_linear_2030_1051)"
      stroke="#6361DD"
      strokeWidth={3}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Defs>
      <LinearGradient
        id="paint0_linear_2030_1051"
        x1={63}
        y1={95}
        x2={82.5}
        y2={-8}
        gradientUnits="userSpaceOnUse"
      >
        <Stop offset={0.61} stopColor="#6361DD" />
        <Stop offset={0.941176} stopColor="#6361DD" stopOpacity={0.8} />
      </LinearGradient>
    </Defs>
  </Svg>
);

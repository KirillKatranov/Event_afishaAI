import * as React from "react";
import Svg, {Path} from "react-native-svg";
import {IllustrationComponentProps} from "@/shared/ui/Illustrations/IllustrationComponentProps";

export const OnboardingLike: React.FC<IllustrationComponentProps> = ({width = 39, height = 37}) => (
    <Svg
      width={width}
      height={height}
      viewBox="0 0 39 37"
      fill="none"
    >
      <Path
        d="M18.346 5.152l1.154 1.39 1.154-1.39c1.858-2.238 4.7-3.652 7.621-3.652 5.132 0 9.225 4.142 9.225 9.59 0 3.324-1.437 6.458-4.247 10.014-2.828 3.577-6.902 7.405-11.951 12.14l-.003.002L19.5 34.94l-1.8-1.694-.002-.002c-5.05-4.735-9.123-8.563-11.95-12.14C2.936 17.547 1.5 14.413 1.5 11.09c0-5.448 4.093-9.59 9.225-9.59 2.92 0 5.763 1.414 7.62 3.652z"
        fill="#fff"
        stroke="#000"
        strokeWidth={3}
      />
    </Svg>
);

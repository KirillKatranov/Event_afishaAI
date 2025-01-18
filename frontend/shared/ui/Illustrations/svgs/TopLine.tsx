import * as React from "react";
import Svg, {Path} from "react-native-svg";
import {IllustrationComponentProps} from "@/shared/ui/Illustrations/IllustrationComponentProps";

export const TopLine: React.FC<IllustrationComponentProps> = ({width = 393, height = 137}) => (
  <Svg
      width={width}
      height={height}
      preserveAspectRatio="none"
      viewBox="0 0 393 137"
      fill="none"
    >
      <Path
        d="M-20.8779 131.953C-7.04755 111.923 6.18592 85.7782 31.9933 80.2726C47.8221 76.8958 64.1658 76.2584 80.3015 75.7096C139.49 73.6964 198.84 74.8168 258.06 74.8168C288.854 74.8168 321.265 77.6302 338.706 48.0341C343.331 40.1847 351.91 28.7821 342.574 20.6561C333.211 12.5069 317.042 5.38 304.384 5.38C301.337 5.38 302.094 9.73976 303.094 11.5301C305.653 16.1083 315.327 16.772 319.759 17.2835C349.774 20.7467 380.821 16.9272 409.432 8.75265"
        stroke="#F1F1F1"
        strokeWidth={10}
        strokeLinecap="round"
      />
    </Svg>
);

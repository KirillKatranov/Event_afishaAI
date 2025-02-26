import * as React from "react";
import Svg, {Path} from "react-native-svg";
import {IconComponentProps} from "@/shared/ui/Icons/IconComponentProps";

const LikeFilled: React.FC<IconComponentProps> = ({width = 26, height = 24, fill = 'black'}) => (
  <Svg
    width={width}
    height={height}
    viewBox="0 0 26 24"
    fill="none"
  >
    <Path
      d="M12.241 3.355L13 4.24l.759-.884C14.993 1.917 16.89 1 18.85 1 22.303 1 25 3.686 25 7.15c0 2.122-.948 4.131-2.821 6.423-1.884 2.305-4.599 4.772-7.966 7.825l-.001.002L13 22.503l-1.212-1.104h-.001c-3.367-3.054-6.082-5.521-7.966-7.826C1.948 11.28 1 9.272 1 7.15 1 3.686 3.697 1 7.15 1c1.96 0 3.857.917 5.091 2.355z"
      fill={fill}
      stroke={fill}
      strokeWidth={2}
    />
  </Svg>
);

export default LikeFilled;

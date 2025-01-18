import * as React from "react";
import Svg, {Path} from "react-native-svg";
import {IllustrationComponentProps} from "@/shared/ui/Illustrations/IllustrationComponentProps";

export const BottomLine: React.FC<IllustrationComponentProps> = ({width = 393, height = 102}) => (
  <Svg
      width={width}
      height={height}
      preserveAspectRatio="none"
      viewBox="0 0 393 102"
      fill="none"
    >
      <Path
        d="M-18 102.092C-10.5435 78.8451 26.5835 73.6548 47.6674 71.738C76.6923 69.0994 105.087 68.167 134.364 68.167C166.341 68.167 199.617 70.1022 231.477 72.6308C260.648 74.946 289.822 75.3091 319.066 75.3091C333.546 75.3091 345.993 73.9293 358.546 66.0839C378.295 53.741 380.16 25.1165 358.744 13.6095C350.255 9.04797 314.106 -2.15432 314.106 14.6014C314.106 25.5283 347.321 25.3145 352.991 25.3145C364.518 25.3145 373.374 22.2814 383.94 18.1725C388.1 16.5546 401.562 16.4574 403.382 12.8159"
        stroke="#F1F1F1"
        strokeWidth={10}
        strokeLinecap="round"
      />
    </Svg>
);

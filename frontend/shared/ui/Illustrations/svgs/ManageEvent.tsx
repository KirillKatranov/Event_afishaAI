import * as React from "react";
import Svg, {
  Path,
  Defs, ClipPath, G, Circle,
} from "react-native-svg"
import {IllustrationComponentProps} from "@/shared/ui/Illustrations/IllustrationComponentProps";

export const ManageEvent: React.FC<IllustrationComponentProps> = ({width = 37, height = 37}) => (
  <Svg
    width={width}
    height={height}
    viewBox="0 0 37 37"
    fill="none"
  >
    <G clipPath="url(#clip0_768_2972)">
      <Circle cx={18.542} cy={19} r={18} fill="#EFDCFF" />
      <Path
        d="M17.212 19.52c-.22-.01-.44-.02-.67-.02-2.42 0-4.68.67-6.61 1.82-.88.52-1.39 1.5-1.39 2.53v1.65c0 .55.45 1 1 1h8.26a6.96 6.96 0 01-.59-6.98zM16.542 18.5a4 4 0 100-8 4 4 0 000 8zM27.292 22.5c0-.22-.03-.42-.06-.63l.84-.73c.18-.16.22-.42.1-.63l-.59-1.02a.49.49 0 00-.59-.22l-1.06.36c-.32-.27-.68-.48-1.08-.63l-.22-1.09a.5.5 0 00-.49-.4h-1.18c-.24 0-.44.17-.49.4l-.22 1.09c-.4.15-.76.36-1.08.63l-1.06-.36a.496.496 0 00-.59.22l-.59 1.02c-.12.21-.08.47.1.63l.84.73c-.03.21-.06.41-.06.63 0 .22.03.42.06.63l-.84.73c-.18.16-.22.42-.1.63l.59 1.02c.12.21.37.3.59.22l1.06-.36c.32.27.68.48 1.08.63l.22 1.09c.05.23.25.4.49.4h1.18c.24 0 .44-.17.49-.4l.22-1.09c.4-.15.76-.36 1.08-.63l1.06.36c.23.08.47-.02.59-.22l.59-1.02c.12-.21.08-.47-.1-.63l-.84-.73c.03-.21.06-.41.06-.63zm-3.75 2c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z"
        fill="#AB41FF"
      />
    </G>
    <Defs>
      <ClipPath id="clip0_768_2972">
        <Path fill="#fff" transform="translate(.542 .5)" d="M0 0H36V36H0z" />
      </ClipPath>
    </Defs>
  </Svg>
);

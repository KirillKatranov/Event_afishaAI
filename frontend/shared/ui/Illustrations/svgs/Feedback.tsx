import * as React from "react";
import Svg, {
  Path,
  Defs, Circle, ClipPath, G,
} from "react-native-svg"
import {IllustrationComponentProps} from "@/shared/ui/Illustrations/IllustrationComponentProps";

export const Feedback: React.FC<IllustrationComponentProps> = ({width = 36, height = 36}) => (
  <Svg
    width={width}
    height={height}
    viewBox="0 0 36 37"
    fill="none"
  >
    <G clipPath="url(#clip0_2139_3492)">
      <Circle cx={18} cy={18.5} r={18} fill="#EFDCFF" />
      <Path
        d="M18.5 22.65c.297 0 .547-.1.749-.302.201-.202.302-.451.301-.748 0-.297-.102-.546-.302-.748-.201-.201-.45-.302-.748-.302-.297 0-.547.1-.748.302-.2.202-.301.451-.302.748 0 .297.1.546.302.749.203.202.452.302.748.301zm0-4.2c.297 0 .547-.1.749-.302.201-.202.302-.451.301-.748v-4.2c0-.297-.1-.547-.302-.748-.202-.2-.451-.301-.748-.302-.297 0-.546.1-.748.302a1.018 1.018 0 00-.302.748v4.2c0 .298.1.547.302.749.202.201.451.302.748.301zm-6.3 7.35l-2.415 2.415c-.332.332-.713.407-1.142.224-.43-.184-.644-.512-.643-.985V11.1c0-.577.206-1.072.617-1.483.412-.41.906-.616 1.483-.617h16.8c.578 0 1.072.206 1.484.617.411.412.617.906.616 1.483v12.6c0 .578-.206 1.072-.616 1.484-.411.411-.906.617-1.484.616H12.2zm-.893-2.1H26.9V11.1H10.1v13.781l1.207-1.181z"
        fill="#AB41FF"
      />
    </G>
    <Defs>
      <ClipPath id="clip0_2139_3492">
        <Path fill="#fff" transform="translate(0 .5)" d="M0 0H36V36H0z" />
      </ClipPath>
    </Defs>
  </Svg>
);

import * as React from "react";
import Svg, {Defs, LinearGradient, Path, Rect, Stop} from "react-native-svg";
import {GradientProps, IconComponentProps} from "@/shared/ui/Icons/IconComponentProps";

const DislikeGradient: React.FC<IconComponentProps> = ({width = 25, height = 25, fill}) => {
  const isGradient = typeof fill !== "string";

  return (
    <Svg
      width={width}
      height={height}
      viewBox="0 0 25 25"
      fill="none"
    >
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M18.917 0a4.167 4.167 0 014.09 3.375l1.915 9.895a4.255 4.255 0 01-4.178 5.064h-7.727l.535 2.679A3.333 3.333 0 0110.284 25H9.167a.833.833 0 01-.754-.479l-3.054-6.49c-.355.193-.76.302-1.192.302H2.5a2.5 2.5 0 01-2.5-2.5V2.5A2.5 2.5 0 012.5 0h1.667c.64 0 1.224.24 1.666.637A2.49 2.49 0 017.5 0h11.417zM3 1.5l-1.5.167c0 .46.147 12.502.157 13.385l.06.819V16l.783.667c-.38-.246-.782-.483-.782-.796L1.499 1.948c0-.46.54-.281 1.001-.281h1.667C2.5 2 3 1.04 3 1.5zm3.667 1c0-.46.373-.833.833-.833h11.417a2.5 2.5 0 012.454 2.025l1.915 9.894a2.589 2.589 0 01-2.541 3.08H12a.833.833 0 00-.817.997l.735 3.677a1.667 1.667 0 01-1.634 1.993h-.589l-2.949-6.267a.833.833 0 01-.08-.355V2.5z"
        fill={isGradient ? `url(#${(fill as GradientProps).id})` : fill}
      />
      <Rect
        x={1}
        width={5}
        height={17}
        rx={2.5}
        fill={isGradient ? `url(#${(fill as GradientProps).id})` : fill}
      />
      {isGradient && (
        <Defs>
          <LinearGradient
            y1={(fill as GradientProps).start?.y || 0}
            y2={(fill as GradientProps).end?.y || 0}
            x1={(fill as GradientProps).start?.x || 0}
            x2={(fill as GradientProps).end?.x || 1}
            id={(fill as GradientProps).id}
          >
            <Stop offset="0%" stopColor={(fill as GradientProps).startColor} />
            <Stop offset="100%" stopColor={(fill as GradientProps).endColor} />
          </LinearGradient>
        </Defs>
      )}
    </Svg>
  );
}

export default DislikeGradient;

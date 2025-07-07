import * as React from "react";
import Svg, {Defs, LinearGradient, Path, Stop} from "react-native-svg";
import {GradientProps, IconComponentProps} from "@/shared/ui/Icons/IconComponentProps";

const LikeGradient: React.FC<IconComponentProps> = ({width = 41, height = 41, fill}) => {
  const isGradient = typeof fill !== "string";

  return (
    <Svg
      width={width}
      height={height}
      viewBox="0 0 41 41"
      fill="none"
    >
      {isGradient && (
        <Defs>
          <LinearGradient
            id={(fill as GradientProps).id}
            x1={(fill as GradientProps).start?.x || 0}
            x2={(fill as GradientProps).end?.x || 1}
            y1={(fill as GradientProps).start?.y || 0}
            y2={(fill as GradientProps).end?.y || 0}
          >
            <Stop offset="0%" stopColor={(fill as GradientProps).startColor} />
            <Stop offset="100%" stopColor={(fill as GradientProps).endColor} />
          </LinearGradient>
        </Defs>
      )}
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M34.66 8.891a7.028 7.028 0 00-10.101 0l-3.165 3.24a1.25 1.25 0 01-1.788 0L16.44 8.89a7.028 7.028 0 00-10.101 0c-2.787 2.852-2.787 7.474 0 10.326L20.5 33.711l14.16-14.494c2.787-2.852 2.787-7.474 0-10.326zM22.77 7.144a9.527 9.527 0 0113.678 0c3.736 3.823 3.736 9.997 0 13.82l-15.054 15.41a1.25 1.25 0 01-1.788 0L4.552 20.963c-3.736-3.823-3.736-9.996 0-13.82a9.527 9.527 0 0113.677 0L20.5 9.468l2.27-2.324z"
        fill={isGradient ? `url(#${(fill as GradientProps).id})` : fill}
      />
    </Svg>
  )
}

export default LikeGradient;

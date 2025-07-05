import * as React from "react";
import Svg, {Defs, LinearGradient, Path, Stop} from "react-native-svg";
import {GradientProps, IconComponentProps} from "@/shared/ui/Icons/IconComponentProps";

const ShareGradient: React.FC<IconComponentProps> = ({width = 25, height = 25, fill}) => {
  const isGradient = typeof fill !== "string";

  return (
    <Svg
      width={width}
      height={height}
      viewBox="0 0 25 25"
      fill="none"
    >
      {isGradient && (
        <Defs>
          <LinearGradient
            id={(fill as GradientProps).id}
            y1={(fill as GradientProps).start?.y || 0}
            y2={(fill as GradientProps).end?.y || 0}
            x1={(fill as GradientProps).start?.x || 0}
            x2={(fill as GradientProps).end?.x || 1}
          >
            <Stop offset="0%" stopColor={(fill as GradientProps).startColor} />
            <Stop offset="100%" stopColor={(fill as GradientProps).endColor} />
          </LinearGradient>
        </Defs>
      )}
      <Path
        d="M10.236 1.43c.096-1.002 1.143-1.828 2.2-1.225 2.194 1.285 4.266 2.75 6.269 4.315 2.473 1.953 4.457 3.794 5.863 5.264.609.64.552 1.65-.03 2.26a53 53 0 01-4.41 4.072c-2.445 2.003-4.977 3.943-7.733 5.498-.935.528-1.948-.075-2.128-1.01l-.022-.143-.286-4.508c-2.291.047-4.51.835-6.283 2.3l-.334.28-.162.13-.311.243-.152.11-.29.203a6.31 6.31 0 01-.275.17l-.26.14C.674 20.131 0 19.6 0 17.212c0-5.556 4.094-10.5 9.628-11.25l.327-.039.281-4.492zm2.409 1.86l-.243 4.38a.63.63 0 01-.564.593l-1.717.18c-3.866.461-6.934 3.484-7.503 7.435a12.552 12.552 0 016.478-2.412l.5-.029 2.15-.045a.631.631 0 01.644.595l.248 4.537c2.023-1.289 3.95-2.77 5.884-4.353a55.537 55.537 0 003.604-3.273l-.325-.323-.701-.673a60.588 60.588 0 00-3.954-3.397 58.03 58.03 0 00-4.502-3.215z"
        fill={isGradient ? `url(#${(fill as GradientProps).id})` : fill}
      />
    </Svg>
  )
}

export default ShareGradient;

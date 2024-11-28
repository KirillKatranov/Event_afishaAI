import * as React from "react"
import Svg, { G, Path, Defs, ClipPath } from "react-native-svg"
import {IconComponentProps} from "@/shared/ui/Icons/IconComponentProps";

const DiagonalArrow: React.FC<IconComponentProps> = ({width = 24, height = 24, fill = 'black'}) => (
  <Svg
    width={width}
    height={height}
    viewBox="0 0 36 36"
    fill="none"
  >
    <G clipPath="url(#clip0_151_1702)">
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M32.67.548c-1.916.304-5.893.575-9.502.959-6.564.686-6.15.607-6.15 1.421 0 1.214 1.646 3.29 4.122 5.207l.526.399c-4.52 4.68-5.478 5.893-11.355 12.857-7.027 8.337-7.155 9.934-9.359 12.537-1.55 1.82.48 2.412 2.316.67 2.46-2.331 7.89-6.691 12.282-9.87 1.165-.83 12.856-9.614 12.856-9.614 3.386 3.418 3.706 3.849 4.504 3.641.32-.08.367-.191.383-1.07.08-2.73 2.029-11.227 2.284-14.837.176-2.843-.782-2.635-2.907-2.3zm1.055 2.588c-.735 2.38-1.949 8.816-2.14 11.34l-.112 1.484c-2.124-2.874-2.604-3.865-5.398-1.74-3.434 2.603-13.96 10.397-14.965 11.147-3.067 2.3-3.067 2.3-1.358.304 3.626-4.2 12.761-15.173 13.703-15.987.048-.256 1.821-.208-1.788-3.386-1.007-.878-1.757-1.613-1.677-1.645.303-.096 9.774-1.038 12.68-1.629 1.087-.208 1.15-.208 1.055.112z"
        fill={fill}
      />
    </G>
    <Defs>
      <ClipPath id="clip0_151_1702">
        <Path fill={fill} d="M0 0H36V36H0z" />
      </ClipPath>
    </Defs>
  </Svg>
);

export default DiagonalArrow;

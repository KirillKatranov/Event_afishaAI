import React from 'react';
import {SvgProps, NumberProp} from 'react-native-svg';
import * as Illustrations from "@/shared/ui/Illustrations/svgs";

const illustrations = {
  arrow: Illustrations.Arrow,
  bottomLine: Illustrations.BottomLine,
  topLine: Illustrations.TopLine,
  like: Illustrations.Like,
  calendar: Illustrations.Calendar,
};

export interface IconProps extends SvgProps {
  name: keyof typeof illustrations;
  width?: NumberProp;
  height?: NumberProp;
}

const Icon: React.FC<IconProps> = ({name, width, height}) => {
  const IllustrationComponent = illustrations[name];

  return <IllustrationComponent width={width} height={height}/>;
};

export default Icon;

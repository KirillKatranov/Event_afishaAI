import React from 'react';
import {SvgProps, NumberProp} from 'react-native-svg';
import * as Icons from "@/shared/ui/Icons";

const icons = {
  back: Icons.Back,
  calendar: Icons.Calendar,
  chevronLeft: Icons.ChevronLeft,
  home: Icons.Home,
  like: Icons.Like,
  location: Icons.Location,
  tags: Icons.Tags,
  user: Icons.User,
  dislike: Icons.Dislike
};

export interface IconProps extends SvgProps {
  name: keyof typeof icons;
  color: string;
  size: NumberProp;
}

const Icon: React.FC<IconProps> = ({name, color, size = 24, ...props}) => {
  const IconComponent = icons[name];

  return <IconComponent width={size} height={size} fill={color} {...props} />;
};

export default Icon;

import React from 'react';
import {SvgProps, NumberProp} from 'react-native-svg';
import * as Icons from "@/shared/ui/Icons";

const icons = {
  back: Icons.Back,
  calendar: Icons.Calendar,
  catalog: Icons.Catalog,
  checkboxBlank: Icons.CheckboxBlank,
  checkboxChecked: Icons.CheckboxChecked,
  chevronLeft: Icons.ChevronLeft,
  chevronDown: Icons.ChevronDown,
  chevronUp: Icons.ChevronUp,
  chevronRight: Icons.ChevronRight,
  cost: Icons.Cost,
  home: Icons.Home,
  like: Icons.Like,
  likeFilled: Icons.LikeFilled,
  location: Icons.Location,
  radioBlank: Icons.RadioBlank,
  radioChecked: Icons.RadioChecked,
  share: Icons.Share,
  swiper: Icons.Swiper,
  tags: Icons.Tags,
  user: Icons.User,
  dislike: Icons.Dislike,
  diagonalArrow: Icons.DiagonalArrow,
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

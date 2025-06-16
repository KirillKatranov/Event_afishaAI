import React from 'react';
import { TouchableOpacity, } from 'react-native';
import { THEME_COLORS, ThemeType } from '@/shared/constants';
import Icon from "@/shared/ui/Icons/Icon";
import {Text} from "@/shared/ui";

interface CheckboxProps {
  theme: ThemeType;
  checked: boolean;
  text: string;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
}

export const Radio: React.FC<CheckboxProps> = ({
  theme,
  checked,
  text,
  onChange,
  disabled = false,
}) => {
  const colors = THEME_COLORS[theme];

  return (
    <TouchableOpacity
      onPress={() => !disabled && onChange(!checked)}
      activeOpacity={0.7}
      disabled={disabled}
      style={{ flexDirection: "row", gap: 8, alignItems: "center", opacity: disabled ? 0.5 : 1 }}
    >
      <Icon
        name={checked ? "radioChecked" : "radioBlank"}
        color={checked ? colors.normal : "#393939"}
        size={24}
      />

      <Text selectable={false} style={{ fontFamily: "MontserratRegular", fontSize: 16 }}>
        {text}
      </Text>
    </TouchableOpacity>
  );
};

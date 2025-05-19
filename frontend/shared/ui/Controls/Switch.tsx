import React, { useRef, useEffect } from 'react';
import {View, Animated, Pressable} from 'react-native';
import { THEME_COLORS, ThemeType } from '@/shared/constants';
import {Text} from "@/shared/ui";

interface SwitchProps {
  theme: ThemeType;
  value: boolean;
  onChange: (value: boolean) => void;
  text: string;
  disabled?: boolean;
  width?: number;
  height?: number;
}

export const Switch: React.FC<SwitchProps> = ({
  theme,
  value,
  onChange,
  text,
  disabled = false,
}) => {
  const colors = THEME_COLORS[theme];
  const width = 40; const height = 24;
  const translateX = useRef(new Animated.Value(value ? width - height : 0)).current;

  useEffect(() => {
    Animated.spring(translateX, {
      toValue: value ? width - height : 0,
      useNativeDriver: true,
      bounciness: 0,
      speed: 12,
    }).start();
  }, [value]);

  return (
    <Pressable
      disabled={disabled}
      onPress={() => !disabled && onChange(!value)}
      style={{ flexDirection: "row", gap: 8, alignItems: "center", justifyContent: "space-between"}}
    >
      <Text selectable={false} style={{ fontFamily: "MontserratRegular", fontSize: 16 }}>
        {text}
      </Text>

      <View
        style={{
          justifyContent: 'center',
          width, height,
          borderRadius: height / 2,
          backgroundColor: disabled ? '#E0E0E0' : (value ? colors.normal : '#E0E0E0'),
        }}
      >
        <Animated.View
          style={{
            position: 'absolute', margin: 2,
            width: height - 4, height: height - 4,
            borderRadius: (height - 4) / 2,
            backgroundColor: disabled ? '#B0B0B0' : "#FFFFFF",
            transform: [{ translateX }],
            shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.2, shadowRadius: 2, elevation: 2,
          }}
        />
      </View>
    </Pressable>
  );
};

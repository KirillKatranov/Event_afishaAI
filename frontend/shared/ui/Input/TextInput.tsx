import React from "react";
import {Box} from "@/shared/ui";
import {StyleProp, TextInput as Input, ViewStyle} from "react-native";

interface TextInputProps {
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  style?: StyleProp<ViewStyle>;
  multiline?: boolean
}

export const TextInput: React.FC<TextInputProps> = ({
  placeholder,
  value,
  onChange,
  style,
  multiline
}) => {
  return (
    <Box style={[{ height: 40 }, style]}>
      <Input
        value={value}
        onChange={(e) => onChange(e.nativeEvent.text)}
        placeholder={placeholder}
        placeholderTextColor={"#B3B3B3"}
        multiline={multiline}
        style={{
          width: "100%", height: "100%",
          borderRadius: 8,
          backgroundColor: "#FFFEF7",
          borderWidth: 1, borderColor: "#D9D9D9",
          paddingHorizontal: 16, paddingVertical: 12,
          fontFamily: "MontserratRegular", fontSize: 16
        }}
      />
    </Box>
  )
}

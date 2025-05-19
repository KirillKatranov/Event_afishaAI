import React from "react";
import {Box} from "@/shared/ui";
import {NativeSyntheticEvent, StyleProp, TextInput as Input, TextInputChangeEventData, ViewStyle} from "react-native";

interface TextInputProps {
  placeholder: string;
  value?: string;
  onChange?: (e: NativeSyntheticEvent<TextInputChangeEventData>) => void;
  style?: StyleProp<ViewStyle>;
}

export const TextInput: React.FC<TextInputProps> = ({
  placeholder,
  value,
  onChange,
  style
}) => {
  return (
    <Box style={[style, { height: 40 }]}>
      <Input
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        placeholderTextColor={"#B3B3B3"}
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

import React, {useState} from "react";
import {Modal, Pressable, StyleProp, Text, TouchableWithoutFeedback, View, ViewStyle} from "react-native";
import DateTimePicker, { DateType, useDefaultStyles } from 'react-native-ui-datepicker';
import {Box, Button} from "@/shared/ui";

interface DateInputProps {
  placeholder?: string;
  date: Date | null;
  onChange: (date: Date) => void;
  style?: StyleProp<ViewStyle>;
}

export const DateInput: React.FC<DateInputProps> = ({
  placeholder = "Выберите дату",
  date,
  onChange,
  style
}) => {
  const defaultStyles = useDefaultStyles();
  const [selectVisible, setSelectVisible] = React.useState(false);
  const [selected, setSelected] = useState<DateType>();

  return (
    <View style={[{ flexDirection: "column" }, style]}>
      <Pressable
        onPress={() => setSelectVisible(true)}
        style={{
          width: "100%", height: 40,
          borderRadius: 8,
          backgroundColor: "#FFFEF7",
          borderWidth: 1, borderColor: "#D9D9D9",
          paddingHorizontal: 16, paddingVertical: 12,
        }}
      >
        <Text style={{ fontFamily: "MontserratRegular", fontSize: 16, color: date ? "#000000" :'#999999FF' }}>
          {date ? date.toLocaleDateString() : placeholder}
        </Text>
      </Pressable>

      <Modal
        visible={selectVisible}
        transparent
        onRequestClose={() => setSelectVisible(!selectVisible)}
      >
        <TouchableWithoutFeedback onPress={() => setSelectVisible(!selectVisible)}>
          <Box style={{
            position: "absolute",
            width: "100%", height: "100%",
            backgroundColor: 'rgba(0,0,0,0.5)',
          }} />
        </TouchableWithoutFeedback>

        <Box style={{ marginVertical: "auto", padding: 16, justifyContent: "center" }}>
          <View style={{ backgroundColor: "white", flexDirection: "column", gap: 16, padding: 16, borderRadius: 16 }}>
            <DateTimePicker
              mode="single"
              date={selected}
              onChange={({ date }) =>  setSelected(date)}
              styles={defaultStyles}
            />

            <Button theme={"organizers"} text={"Подтвердить"} onPress={() => {
              setSelectVisible(false)
              onChange(selected as Date);
            }}/>
          </View>
        </Box>
      </Modal>
    </View>
  )
}

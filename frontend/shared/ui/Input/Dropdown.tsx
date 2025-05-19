import React, { useState, useRef } from 'react';
import {
  TouchableOpacity,
  StyleSheet,
  Animated,
  Easing,
  FlatList,
  Modal,
  TouchableWithoutFeedback
} from 'react-native';
import Icon from "@/shared/ui/Icons/Icon";
import {Box, Text} from "@/shared/ui";

interface DropdownItem {
  label: string;
  value: string;
}

interface DropdownProps {
  items: DropdownItem[];
  selectedValue?: string | null;
  placeholder?: string;
  onSelect: (value: string) => void;
  disabled?: boolean;
  style?: object;
}

export const Dropdown: React.FC<DropdownProps> = ({
  items,
  selectedValue,
  placeholder = 'Выберите...',
  onSelect,
  disabled = false,
  style
}) => {
  const [visible, setVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState<DropdownItem | null>(null);
  const rotateAnim = useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    if (selectedValue) {
      const item = items.find(i => i.value === selectedValue) || null;
      setSelectedItem(item);
    }
  }, [selectedValue, items]);

  const toggleDropdown = () => {
    if (disabled) return;

    Animated.timing(rotateAnim, {
      toValue: visible ? 0 : 1,
      duration: 200,
      easing: Easing.linear,
      useNativeDriver: true,
    }).start();

    setVisible(!visible);
  };

  const onItemPress = (item: DropdownItem) => {
    setSelectedItem(item);
    onSelect(item.value);
    toggleDropdown();
  };

  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  return (
    <Box style={[styles.container, style]}>
      <TouchableOpacity
        style={[
          styles.dropdownButton,
          disabled && { backgroundColor: '#F5F5F5', borderColor: '#EEE',},
        ]}
        onPress={toggleDropdown}
        activeOpacity={0.7}
        disabled={disabled}
      >
        <Text style={[
          { fontFamily: "MontserratRegular", fontSize: 16, color: '#000000' },
          (!selectedItem || disabled) && { color: '#999999FF' },
        ]}>
          {selectedItem ? selectedItem.label : placeholder}
        </Text>

        <Animated.View style={{ transform: [{ rotate }] }}>
          {visible ? (
            <Icon name={"chevronUp"} size={16} color={disabled ? '#999' : '#000000'} />
          ) : (
            <Icon name={"chevronUp"} size={16} color={disabled ? '#999' : '#000000'} />
          )}
        </Animated.View>
      </TouchableOpacity>

      <Modal
        visible={visible}
        transparent
        onRequestClose={toggleDropdown}
      >
        <TouchableWithoutFeedback onPress={toggleDropdown}>
          <Box style={styles.modalOverlay} />
        </TouchableWithoutFeedback>

        <Box style={{ marginVertical: "auto", padding: 16, justifyContent: "center" }}>
          <FlatList
            data={items}
            keyExtractor={(item) => item.value}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[
                  { paddingHorizontal: 16, paddingVertical: 12, },
                  selectedItem?.value === item.value && { backgroundColor: '#F5F5F5', }
                ]}
                onPress={() => onItemPress(item)}
              >
                <Text style={{ fontFamily: "MontserratRegular", fontSize: 16, color: '#333333FF', }}>{item.label}</Text>
              </TouchableOpacity>
            )}
            ItemSeparatorComponent={() => <Box style={{ height: 1, backgroundColor: '#EEEEEEFF', }} />}
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: 8, borderWidth: 1, borderColor: '#EEEEEE',
              shadowColor: '#000000',
              shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 8, elevation: 5,
            }}
          />
        </Box>
      </Modal>
    </Box>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    position: 'relative',
  },
  dropdownButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#D9D9D9',
    borderRadius: 8,
    backgroundColor: '#FFFEF7',
  },
  modalOverlay: {
    position: "absolute",
    width: "100%", height: "100%",
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
});

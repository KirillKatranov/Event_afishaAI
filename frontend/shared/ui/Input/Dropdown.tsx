import React, { useState, useRef } from 'react';
import {
  TouchableOpacity,
  StyleSheet,
  Animated,
  Easing,
  FlatList,
  Modal,
  TouchableWithoutFeedback,
  View
} from 'react-native';
import Icon from "@/shared/ui/Icons/Icon";
import {Box, Text} from "@/shared/ui";
import { Checkbox } from "@/shared/ui";

interface DropdownProps {
  items: { label: string; value: string }[];
  selectedValues?: string[];
  placeholder?: string;
  onSelect: (values: string[]) => void;
  disabled?: boolean;
  style?: object;
  multiple?: boolean;
}

export const Dropdown: React.FC<DropdownProps> = ({
  items,
  selectedValues = [],
  placeholder = 'Выберите...',
  onSelect,
  disabled = false,
  style,
  multiple = false
}) => {
  const [visible, setVisible] = useState(false);
  const [selectedItems, setSelectedItems] = useState<string[]>(selectedValues);
  const rotateAnim = useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    setSelectedItems(selectedValues);
  }, [selectedValues]);

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

  const onItemPress = (itemValue: string) => {
    let newSelectedItems: string[];

    if (multiple) {
      // Для множественного выбора
      if (selectedItems.includes(itemValue)) {
        newSelectedItems = selectedItems.filter(val => val !== itemValue);
      } else {
        newSelectedItems = [...selectedItems, itemValue];
      }
    } else {
      // Для одиночного выбора
      newSelectedItems = selectedItems.includes(itemValue) ? [] : [itemValue];
      setVisible(false); // Закрываем dropdown после выбора в одиночном режиме
    }

    setSelectedItems(newSelectedItems);
    onSelect(newSelectedItems);
  };

  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  const getDisplayText = () => {
    if (selectedItems.length === 0) return placeholder;

    if (multiple) {
      if (selectedItems.length === items.length) return 'Все выбраны';
      if (selectedItems.length > 3) return `Выбрано ${selectedItems.length}`;

      return items
        .filter(item => selectedItems.includes(item.value))
        .map(item => item.label)
        .join(', ');
    }

    // Для одиночного выбора
    return items.find(item => item.value === selectedItems[0])?.label || placeholder;
  };

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
        <Text
          style={[
            styles.buttonText,
            (!selectedItems.length || disabled) && { color: '#999999FF' },
          ]}
          numberOfLines={1}
        >
          {getDisplayText()}
        </Text>

        <Animated.View style={{ transform: [{ rotate }] }}>
          <Icon
            name={"chevronUp"}
            size={16}
            color={disabled ? '#999' : '#000000'}
          />
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

        <Box style={styles.modalContent}>
          <Box style={styles.listContainer}>
            <FlatList
              data={items}
              keyExtractor={(item) => item.value}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.itemContainer,
                    selectedItems.includes(item.value) && styles.selectedItem
                  ]}
                  onPress={() => onItemPress(item.value)}
                >
                  {multiple && (
                    <Checkbox
                      checked={selectedItems.includes(item.value)}
                      onChange={() => onItemPress(item.value)}
                      text={""}
                      theme={'organizers'}
                    />
                  )}
                  <Text style={styles.itemText}>{item.label}</Text>
                </TouchableOpacity>
              )}
              ItemSeparatorComponent={() => <View style={styles.separator} />}
              style={styles.list}
            />
          </Box>

          {multiple && (
            <TouchableOpacity
              style={styles.confirmButton}
              onPress={() => {
                onSelect(selectedItems);
                setVisible(false);
              }}
            >
              <Text style={styles.confirmButtonText}>Применить</Text>
            </TouchableOpacity>
          )}
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
  buttonText: {
    fontFamily: "MontserratRegular",
    fontSize: 16,
    color: '#000000',
    flex: 1,
    marginRight: 8,
  },
  modalOverlay: {
    position: "absolute",
    width: "100%",
    height: "100%",
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    flex: 1,
    justifyContent: 'center',
    marginHorizontal: 20,
  },
  listContainer: {
    maxHeight: '70%',
  },
  list: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#EEEEEE',
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    height: 50,
  },
  selectedItem: {
    backgroundColor: '#F5F5F5',
  },
  itemText: {
    fontFamily: "MontserratRegular",
    fontSize: 16,
    color: '#333333FF',
    flex: 1,
  },
  separator: {
    height: 1,
    backgroundColor: '#EEEEEEFF',
  },
  confirmButton: {
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  confirmButtonText: {
    color: 'white',
    fontFamily: 'MontserratMedium',
    fontSize: 16,
  },
});

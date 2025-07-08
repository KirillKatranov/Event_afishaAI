import React, { useState, useRef } from 'react';
import {
  View,
  TextInput,
  FlatList,
  Text,
  TouchableOpacity,
  StyleSheet,
  Keyboard,
  TouchableWithoutFeedback,
  Pressable
} from 'react-native';

interface SearchBarProps {
  query: string;
  setQuery: (query: string) => void;
  onSearch: (query: string) => void;
  fetchSuggestions: (query: string, username: string) => Promise<string[]>;
  username: string;
  minCharsForSuggestions?: number;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  query,
  setQuery,
  onSearch,
  fetchSuggestions,
  username,
  minCharsForSuggestions = 2,
}) => {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<TextInput>(null);

  const debouncedFetchSuggestions = (searchQuery: string) => {
    if (searchQuery.length >= minCharsForSuggestions) {
      setIsLoading(true);
      fetchSuggestions(searchQuery, username)
        .then((data) => {
          setSuggestions(data);
          setShowSuggestions(true);
        })
        .catch((error) => {
          console.error('Error fetching suggestions:', error);
          setSuggestions([]);
        })
        .finally(() => setIsLoading(false));
    } else {
      setSuggestions([]);
    }
  };

  const handleChangeText = (text: string) => {
    setQuery(text);
    setTimeout(() => debouncedFetchSuggestions(text), 150);
  }

  const handleSearch = () => {
    Keyboard.dismiss();
    setShowSuggestions(false);
    onSearch(query);
  };

  const handleSuggestionPress = (suggestion: string) => {
    setQuery(suggestion);
    setShowSuggestions(false);
    onSearch(suggestion);
    inputRef.current?.blur();
  };

  const clearSearch = () => {
    setQuery('');
    onSearch("")
    setSuggestions([]);
    setShowSuggestions(false);
  };

  // Обработчик клика по оверлею (вне области поиска)
  const handleOverlayPress = () => {
    setShowSuggestions(false);
    inputRef.current?.blur();
  };

  return (
    <View style={styles.wrapper}>
      {/* Оверлей, который появляется при открытых подсказках */}
      {showSuggestions && (
        <TouchableWithoutFeedback onPress={handleOverlayPress}>
          <View style={styles.overlay} />
        </TouchableWithoutFeedback>
      )}

      <View style={styles.container}>
        <View style={styles.searchContainer}>
          <TextInput
            ref={inputRef}
            style={styles.input}
            placeholder={"Поиск..."}
            placeholderTextColor={"#dfdddc"}
            value={query}
            onChangeText={handleChangeText}
            onSubmitEditing={handleSearch}
            returnKeyType="search"
            onFocus={() => setShowSuggestions(query.length >= minCharsForSuggestions)}
          />
          {query ? (
            <TouchableOpacity onPress={clearSearch} style={styles.clearButton}>
              <Text style={styles.clearButtonText}>×</Text>
            </TouchableOpacity>
          ) : null}
        </View>

        {isLoading && (
          <View style={styles.suggestionsContainer}>
            <Text style={styles.loadingText}>Загрузка...</Text>
          </View>
        )}

        {showSuggestions && suggestions.length > 0 && (
          <View style={styles.suggestionsContainer}>
            <FlatList
              data={suggestions}
              keyExtractor={(item, index) => item + index}
              renderItem={({ item }) => (
                <Pressable
                  style={styles.suggestionItem}
                  onPress={() => handleSuggestionPress(item)}
                >
                  <Text>{item}</Text>
                </Pressable>
              )}
              keyboardShouldPersistTaps="handled"
            />
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    zIndex: 100,
    flex: 1,
  },
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'transparent',
  },
  container: {
    zIndex: 101,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  input: {
    flex: 1,
    fontSize: 16,
    borderWidth: 0,
    outline: "none",
  },
  clearButton: {
    marginLeft: 8,
    padding: 4,
  },
  clearButtonText: {
    fontSize: 20,
    color: '#999',
  },
  suggestionsContainer: {
    position: 'absolute',
    top: 50,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderRadius: 8,
    maxHeight: 200,
    borderWidth: 1,
    borderColor: '#eee',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    zIndex: 102, // Должен быть выше всего
  },
  suggestionItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f5f5f5',
  },
  loadingText: {
    padding: 12,
    color: '#999',
    textAlign: 'center',
  },
});

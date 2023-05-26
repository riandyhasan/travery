import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { View, FlatList, TextInput, TouchableOpacity, StyleSheet, Text } from 'react-native';
import { SCREEN_HEIGHT, SCREEN_WIDTH } from '@src/utils/deviceDimensions';
import ImageView from '@src/components/ImageView';
import { Ionicons } from '@expo/vector-icons';
import colors from '@src/styles/colors';
import SearchJournal from './Journal';
import SearchCategory from './Category';

const imgSize = 100;
const iconSize = 20;

const SearchScreen = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const navigation = useNavigation();

  return (
    <View style={{ flex: 1, backgroundColor: 'white' }}>
      <FlatList
        style={{ flex: 1 }}
        contentContainerStyle={{ flexGrow: 1 }}
        ListHeaderComponent={
          <>
            <View style={{ position: 'relative' }}>
              <ImageView name='search' style={{ height: SCREEN_HEIGHT * 0.45 }} resizeMode='cover' background={true} />
              <View style={styles.searchContainer}>
                <Ionicons name='search' size={iconSize} color={colors.primaryGray} style={styles.searchIcon} />
                <TextInput
                  style={styles.searchInput}
                  placeholder='Search...'
                  placeholderTextColor={colors.primaryGray}
                  autoFocus={false}
                />
              </View>
            </View>
            <View style={{ marginTop: 20, paddingHorizontal: 10 }}>
              <Text style={{ fontFamily: 'ssprobold', color: colors.primaryGreen, fontSize: 24 }}>Popular Journal</Text>
            </View>
          </>
        }
        data={[1]}
        renderItem={({ item }) => (
          <View style={{ marginTop: 20, paddingHorizontal: 10 }}>
            <SearchJournal />
          </View>
        )}
        keyExtractor={(item, index) => index.toString()}
        ListFooterComponent={
          <View style={{ marginTop: 20, paddingHorizontal: 10, paddingBottom: 100 }}>
            <Text style={{ fontFamily: 'ssprobold', color: colors.primaryGreen, fontSize: 24 }}>Categories</Text>
            <SearchCategory />
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  searchContainer: {
    position: 'absolute',
    top: SCREEN_WIDTH * 0.15,
    left: 16,
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 20,
    paddingVertical: 4,
    paddingHorizontal: 8,
    elevation: 4,
  },
  searchIcon: {
    marginLeft: 4,
  },
  searchInput: {
    flex: 1,
    height: 36,
    paddingHorizontal: 8,
    fontSize: 16,
    color: 'black',
  },
});

export default SearchScreen;

import React from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import SearchCard from '@src/components/Cards/Search';
import { SCREEN_WIDTH } from '@src/utils/deviceDimensions';

const SearchJournal = () => {
  const data = Array.from({ length: 10 }, (_, idx) => idx); // Generate an array of 10 items

  const renderCard = ({ item }) => (
    <View style={styles.cardContainer}>
      <SearchCard />
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList data={data} renderItem={renderCard} keyExtractor={(item) => item.toString()} horizontal />
    </View>
  );
};

const numColumns = 1.64;
const cardWidth = SCREEN_WIDTH / numColumns;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 10,
    paddingTop: 5,
  },
  cardContainer: {
    width: cardWidth,
    padding: 5,
    marginLeft: 10,
  },
});

export default SearchJournal;

import React from 'react';
import { View, FlatList, StyleSheet, Dimensions, Text } from 'react-native';
import StoryCard from '@src/components/Cards/Story';
import { SCREEN_WIDTH } from '@src/utils/deviceDimensions';
import ImageView from '@src/components/ImageView';
import { TouchableOpacity } from 'react-native-gesture-handler';

const SearchCategory = () => {
  const data = ['beach', 'city', 'nature', 'others'];

  const renderItem = ({ item }: { item: string }) => (
    <View style={styles.cardContainer}>
      <View style={{ position: 'relative', justifyContent: 'center' }}>
        <TouchableOpacity style={{ position: 'relative', justifyContent: 'center' }}>
          <View
            style={{ flexDirection: 'row', width: '100%', position: 'absolute', zIndex: 50, justifyContent: 'center' }}>
            <Text style={{ fontFamily: 'ssprobold', fontSize: 18, color: 'white' }}>{item.toUpperCase()}</Text>
          </View>
          <ImageView name={'category-' + item} background={true} style={{ height: 88 }} />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={(item) => item.toString()}
        numColumns={2}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
};

const cardWidth = SCREEN_WIDTH / 2.2;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: 10,
    paddingTop: 10,
  },
  cardContainer: {
    width: cardWidth,
    padding: 5,
  },
});

export default SearchCategory;

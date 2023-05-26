import React from 'react';
import { View, FlatList, StyleSheet, Pressable } from 'react-native';
import SearchCard from '@src/components/Cards/Search';
import { SCREEN_WIDTH } from '@src/utils/deviceDimensions';
import { JournalData } from '@src/types/Journal';
import { store } from '@src/redux/store';
import { useNavigation } from '@react-navigation/native';
import { routeDetail } from '@src/redux/actions/params';
const SearchJournal = ({ data }: { data: JournalData[] }) => {
  const navigation = useNavigation();
  const handleOnPressCard = (item: JournalData) => {
    store.dispatch(routeDetail({ journal: item.id, story: null }));
    navigation.navigate('DetailJournal' as never);
  };
  const renderCard = ({ item }: { item: JournalData }) => (
    <Pressable style={styles.cardContainer} key={item.id} onPress={() => handleOnPressCard(item)}>
      <SearchCard name={item.title} likes={item.likes.length} comment={item.comments.length} imageUrl={item.image} />
    </Pressable>
  );

  return (
    <View style={styles.container}>
      <FlatList data={data} renderItem={renderCard} keyExtractor={(item) => item.id.toString()} horizontal />
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

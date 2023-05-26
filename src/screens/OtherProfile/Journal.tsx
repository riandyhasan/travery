import React from 'react';
import { View, FlatList, StyleSheet, Dimensions, Pressable } from 'react-native';
import JournalCard from '@src/components/Cards/Journal';
import { SCREEN_WIDTH } from '@src/utils/deviceDimensions';
import { JournalData } from '@src/types/Journal';
import { store } from '@src/redux/store';
import { useNavigation } from '@react-navigation/native';
import { routeDetail } from '@src/redux/actions/params';

const ProfileJournal = ({ data }: { data: JournalData[] }) => {
  const navigation = useNavigation();
  const handleOnPressCard = (item: JournalData) => {
    store.dispatch(routeDetail({ journal: item.id, story: null }));
    navigation.navigate('DetailJournal' as never);
  };

  const renderItem = ({ item }: { item: JournalData }) => (
    <Pressable style={styles.cardContainer} key={item.id} onPress={() => handleOnPressCard(item)}>
      <JournalCard
        title={item.title}
        startDate={item.startDate}
        endDate={item.endDate}
        location={item.location}
        imageUrl={item.image}
      />
    </Pressable>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
};

const cardWidth = SCREEN_WIDTH / 2.1;

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

export default ProfileJournal;

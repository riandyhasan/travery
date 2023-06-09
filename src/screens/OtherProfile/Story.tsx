import React from 'react';
import { View, FlatList, StyleSheet, Dimensions, Pressable } from 'react-native';
import StoryCard from '@src/components/Cards/Story';
import { SCREEN_WIDTH } from '@src/utils/deviceDimensions';
import { StoryData } from '@src/types/Story';
import { store } from '@src/redux/store';
import { useNavigation } from '@react-navigation/native';
import { routeDetail } from '@src/redux/actions/params';

const ProfileStory = ({ data }: { data: StoryData[] }) => {
  const dateToFormat = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    };

    const formattedDate: string = date.toLocaleDateString('en-US', options);
    return formattedDate;
  };

  const navigation = useNavigation();
  const handleOnPressCard = (item: StoryData) => {
    store.dispatch(routeDetail({ journal: item.journal, story: item.id }));
    navigation.navigate('DetailJournal' as never);
  };
  const renderItem = ({ item }: { item: StoryData }) => (
    <Pressable style={styles.cardContainer} key={item.id} onPress={() => handleOnPressCard(item)}>
      <StoryCard
        title={item.title}
        journal={item.journalTitle}
        day={dateToFormat(item.day)}
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

export default ProfileStory;

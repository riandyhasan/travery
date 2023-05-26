import React from 'react';
import { View, ScrollView, StyleSheet, Dimensions } from 'react-native';
import JournalDrafCard from '@src/components/Cards/Plan';
import { SCREEN_WIDTH } from '@src/utils/deviceDimensions';
import { PlanData } from '@src/types/Plan';
import { differenceInDays } from 'date-fns';

const JournalDrafs = ({ data }: { data: PlanData[] }) => {
  const dateToFormat = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    };

    const formattedDate: string = date.toLocaleDateString('en-US', options);
    return formattedDate;
  };

  const calculateDateDifference = (startDate: Date, endDate: Date): number => {
    return differenceInDays(endDate, startDate) + 1;
  };

  const renderCards = () => {
    return data.map((item) => (
      <View style={styles.cardContainer} key={item.id}>
        <JournalDrafCard
          id={item.id}
          destination={item.destination}
          endDate={dateToFormat(item.startDate)}
          duration={calculateDateDifference(item.startDate, item.endDate)}
        />
      </View>
    ));
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.row}>{renderCards()}</View>
    </ScrollView>
  );
};

const numColumns = 1.2;
const cardWidth = SCREEN_WIDTH / numColumns;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 10,
    paddingTop: 5,
    paddingBottom: 50,
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  cardContainer: {
    width: cardWidth,
    padding: 5,
    marginTop: 10,
  },
});

export default JournalDrafs;

import { useNavigation, useFocusEffect } from '@react-navigation/native';
import React, { useState, useCallback } from 'react';
import { Pressable, StyleSheet } from 'react-native';
import { Text, View, FlatList } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useSelector } from 'react-redux';
import { RootState } from '@src/types/Root';
import { SCREEN_WIDTH, SCREEN_HEIGHT } from '@src/utils/deviceDimensions';
import Toast from 'react-native-toast-message';
import { store } from '@src/redux/store';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import colors from '@src/styles/colors';
import { JournalData } from '@src/types/Journal';
import JournalCard from '@src/components/Cards/Journal';
import { getUserJournals } from '@src/services/journal';
import { routeJournal } from '@src/redux/actions/params';

const EditProfile = () => {
  const navigation = useNavigation();
  const { goBack, canGoBack } = useNavigation();
  const user = useSelector((state: RootState) => state.user);
  const [journalData, setJournalData] = useState<JournalData[]>([]);

  const getUserJournal = async () => {
    if (user?.username) {
      const db_journal = await getUserJournals(user.username);
      if (db_journal != null) {
        setJournalData(db_journal);
      }
    }
  };
  const handleBack = () => {
    if (canGoBack()) {
      goBack();
    }
  };

  const handleCreateJournal = () => {
    navigation.navigate('NewJournal' as never);
  };

  const handleCreateStory = (id: string) => {
    store.dispatch(routeJournal({ journal: id }));
    navigation.navigate('NewStory' as never);
  };

  useFocusEffect(
    useCallback(() => {
      getUserJournal();
    }, [])
  );

  const renderItem = ({ item }: { item: JournalData }) => (
    <View style={styles.cardContainer}>
      <TouchableOpacity onPress={() => handleCreateStory(item.id)}>
        <JournalCard
          title={item.title}
          startDate={item.startDate}
          endDate={item.endDate}
          location={item.location}
          imageUrl={item.image}
        />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: 'white', position: 'relative' }}>
      <View style={{ zIndex: 100 }}>
        <Toast position='top' topOffset={SCREEN_HEIGHT * 0.05} />
      </View>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          width: '100%',
          position: 'absolute',
          top: 50,
          paddingHorizontal: 20,
          alignItems: 'center',
          zIndex: 50,
        }}>
        <TouchableOpacity onPress={handleBack} activeOpacity={0.75}>
          <View style={{ padding: 6, borderRadius: 20 }}>
            <MaterialIcons name='keyboard-backspace' size={32} color={colors.primaryGreen} />
          </View>
        </TouchableOpacity>
        <Text style={{ color: colors.primaryGreen, fontSize: 24, fontFamily: 'ssprobold' }}>New Story</Text>
        <TouchableOpacity onPress={() => null} activeOpacity={0.75}>
          <Text style={{ color: colors.white, fontSize: 18, fontFamily: 'ssprobold' }}>Post</Text>
        </TouchableOpacity>
      </View>
      <View style={{ flex: 1, marginTop: 100 }}>
        <View style={styles.container}>
          {journalData.length > 0 ? (
            <FlatList
              data={journalData}
              renderItem={renderItem}
              keyExtractor={(item) => item.toString()}
              numColumns={2}
              contentContainerStyle={styles.listContent}
            />
          ) : (
            <View style={{ alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%' }}>
              <Ionicons name='journal-outline' size={100} color={colors.ternaryGray} />
              <Text style={{ fontFamily: 'ssprobold', color: colors.ternaryGray, fontSize: 20 }}>
                You have no journal yet
              </Text>
              <Pressable onPress={handleCreateJournal}>
                <Text style={{ fontFamily: 'ssprobold', color: colors.primaryGreen, fontSize: 18 }}>Create One?</Text>
              </Pressable>
            </View>
          )}
        </View>
      </View>
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

export default EditProfile;

import React, { useState, useCallback, useEffect } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
import { View, FlatList, TextInput, Pressable, StyleSheet, Text, Modal, ScrollView } from 'react-native';
import { SCREEN_HEIGHT, SCREEN_WIDTH } from '@src/utils/deviceDimensions';
import ImageView from '@src/components/ImageView';
import { Ionicons } from '@expo/vector-icons';
import colors from '@src/styles/colors';
import SearchJournal from './Journal';
import SearchCategory from './Category';
import { JournalData } from '@src/types/Journal';
import { UserData } from '@src/types/User';
import { getPopularJournal } from '@src/services/journal';
import { getAllUser } from '@src/services/user';
import { store } from '@src/redux/store';
import { useSelector } from 'react-redux';
import { RootState } from '@src/types/Root';
import { routeUser } from '@src/redux/actions/params';
import { TouchableOpacity } from 'react-native-gesture-handler';

const iconSize = 20;

const SearchScreen = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [popularJournal, setPopularJournal] = useState<JournalData[]>([]);
  const [allUser, setAllUser] = useState<UserData[]>([]);
  const [query, setQuery] = useState<string>('');
  const [queryData, setQueryData] = useState<UserData[]>([]);
  const navigation = useNavigation();
  const user = useSelector((state: RootState) => state.user);

  const handleCloseSearch = () => {
    setIsSearchOpen(false);
    setQuery('');
    setQueryData([]);
  };

  const fetchPopularJournal = async () => {
    const data = await getPopularJournal();
    if (data != null) {
      setPopularJournal(data);
    }
  };

  const fetchAllUser = async () => {
    const data = await getAllUser();
    setAllUser(data);
  };

  const handleStalk = (username: string) => {
    if (username !== user.username) {
      console.log(username);
      store.dispatch(routeUser({ user: username }));
      setQuery('');
      setQueryData([]);
      setIsSearchOpen(false);
      navigation.navigate('UserProfile' as never);
    }
  };

  const renderQuery = () => {
    return queryData.map((item: UserData) => (
      <Pressable style={styles.cardContainer} key={item.id} onPress={() => handleStalk(item.username)}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <View style={{ overflow: 'hidden' }}>
            <ImageView
              name={'avatar'}
              remoteAssetFullUri={item.avatar}
              style={{ borderRadius: 100, width: 40, height: 40 }}
              resizeMode='cover'
            />
          </View>
          <View style={{ marginLeft: 20 }}>
            <Text style={{ fontFamily: 'ssprobold', fontSize: 18 }}>
              {item.name !== '' ? item.name : item.username}
            </Text>
            <Text style={{ fontFamily: 'sspro', color: '#C0C0C0' }}>{item.username}</Text>
          </View>
        </View>
      </Pressable>
    ));
  };

  useFocusEffect(
    useCallback(() => {
      fetchPopularJournal();
      fetchAllUser();
    }, [])
  );

  const queryUser = () => {
    if (query !== '') {
      const filteredUsers = allUser.filter(
        (q: UserData) =>
          query && q.username && q.username.toLowerCase().includes(query.toLowerCase()) && q.username !== user.username
      );
      setQueryData(filteredUsers);
    }
  };

  useEffect(() => {
    queryUser();
  }, [query]);

  return (
    <View style={{ flex: 1, backgroundColor: 'white' }}>
      <Modal visible={isSearchOpen} transparent={false} animationType='slide'>
        <View style={{ flex: 1, position: 'relative' }}>
          <View style={[styles.searchContainer, { top: SCREEN_HEIGHT * 0.08, backgroundColor: '#F0F0F0' }]}>
            <Ionicons name='search' size={iconSize} color={colors.primaryGray} style={styles.searchIcon} />
            <TextInput
              style={[styles.searchInput]}
              placeholder='Search...'
              placeholderTextColor={colors.primaryGray}
              autoFocus={true}
              // onBlur={handleCloseSearch}
              value={query}
              onChangeText={setQuery}
            />
            <TouchableOpacity onPress={handleCloseSearch}>
              <Ionicons name='close' size={iconSize} color={colors.black} style={styles.searchIcon} />
            </TouchableOpacity>
          </View>
          <View style={{ marginTop: 130, paddingHorizontal: 20 }}>
            <Text style={{ fontFamily: 'ssprobold', fontSize: 20, color: colors.primaryGreen }}>Profile</Text>
            <ScrollView contentContainerStyle={styles.container}>
              <View style={styles.row}>{renderQuery()}</View>
            </ScrollView>
          </View>
        </View>
      </Modal>
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
                  value={query}
                  onChangeText={setQuery}
                  onFocus={() => setIsSearchOpen(true)}
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
            <SearchJournal data={popularJournal} />
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

const numColumns = 1.2;
const cardWidth = SCREEN_WIDTH / numColumns;

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
  cardContainer: {
    width: cardWidth,
    padding: 5,
    marginTop: 10,
  },
  container: {
    paddingHorizontal: 10,
    paddingTop: 5,
    paddingBottom: 50,
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
});

export default SearchScreen;

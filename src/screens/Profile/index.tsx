import { useState, useCallback } from 'react';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import ImageView from '@src/components/ImageView';
import { SCREEN_WIDTH } from '@src/utils/deviceDimensions';
import { Ionicons, MaterialCommunityIcons, AntDesign } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useSelector } from 'react-redux';
import { RootState } from '@src/types/Root';
import { UserData } from '@src/types/User';
import { getUserByUsername } from '@src/services/user';
import colors from '@src/styles/colors';
import ProfileInfo from './Information';
import ProfileStory from './Story';
import ProfileJournal from './Journal';
import { useSwipe } from '@src/utils/hooks';
import { getAuth, signOut } from 'firebase/auth';
import { store } from '@src/redux/store';
import { authLogout } from '@src/redux/actions/auth';
import { userLogout } from '@src/redux/actions/user';
import { JournalData } from '@src/types/Journal';
import { getUserJournals } from '@src/services/journal';
import { StoryData } from '@src/types/Story';
import { getUserStories } from '@src/services/story';

const Profile = () => {
  const imgSize = 100;
  const iconSize = 20;
  const user = useSelector((state: RootState) => state.user);
  const navigation = useNavigation();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [journalData, setJournalData] = useState<JournalData[]>([]);
  const [storyData, setStoryData] = useState<StoryData[]>([]);
  const [screen, setScreen] = useState<string>('trip');

  const handleGoToEdit = () => {
    navigation.navigate('EditProfile' as never);
  };

  const handleLogOut = () => {
    const auth = getAuth();
    signOut(auth)
      .then(() => {
        store.dispatch(userLogout());
        store.dispatch(authLogout());
        navigation.navigate('Login' as never);
      })
      .catch((error) => {
        // An error happened.
      });
  };

  const getUserData = async () => {
    if (user?.username) {
      const db_user = await getUserByUsername(user.username);
      setUserData(db_user);
    }
  };

  const getUserJournal = async () => {
    if (user?.username) {
      const db_journal = await getUserJournals(user.username);
      if (db_journal != null) {
        setJournalData(db_journal);
      }
    }
  };

  const getUserStory = async () => {
    if (user?.username) {
      const db_story = await getUserStories(user.username);
      if (db_story != null) {
        setStoryData(db_story);
      }
    }
  };

  const handleSwipeRight = () => {
    const currentIndex = screens.indexOf(screen);
    if (currentIndex > 0) {
      setScreen(screens[currentIndex - 1]);
    }
  };

  const handleSwipeLeft = () => {
    const currentIndex = screens.indexOf(screen);
    if (currentIndex < screens.length - 1) {
      setScreen(screens[currentIndex + 1]);
    }
  };

  const screens = ['trip', 'story', 'info'];

  const { onTouchStart, onTouchEnd } = useSwipe(handleSwipeLeft, handleSwipeRight, 6);

  useFocusEffect(
    useCallback(() => {
      getUserData();
      getUserJournal();
      getUserStory();
    }, [])
  );

  return (
    // <SafeAreaView style={{flex: 1}}>
    <View style={{ flex: 1, backgroundColor: 'white' }}>
      <View style={{ position: 'relative' }}>
        <ImageView name='header' style={{ height: 188 }} resizeMode='cover' background={true} />
        <View
          style={{
            width: imgSize,
            height: imgSize,
            borderRadius: imgSize / 2,
            borderWidth: 1,
            borderColor: 'white',
            position: 'absolute',
            bottom: -(imgSize / 2),
            left: SCREEN_WIDTH / 2 - imgSize / 2,
          }}>
          <ImageView
            name='avatar'
            remoteAssetFullUri={user.avatar !== null && user.avatar !== '' ? user.avatar : ''}
            style={{ height: '100%', width: '100%', borderRadius: 100 }}
            resizeMode='cover'
          />
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
          }}>
          <TouchableOpacity onPress={handleGoToEdit} activeOpacity={0.75}>
            <View style={{ backgroundColor: 'white', padding: 6, borderRadius: iconSize }}>
              <Ionicons name='pencil' size={iconSize} />
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleLogOut} activeOpacity={0.75}>
            <View style={{ backgroundColor: colors.red, padding: 6, borderRadius: iconSize }}>
              <AntDesign name='logout' size={iconSize} color={'white'} />
            </View>
          </TouchableOpacity>
        </View>
      </View>
      <View style={{ paddingTop: imgSize / 2 + 20, alignItems: 'center' }}>
        <Text style={{ fontSize: 20, fontFamily: 'ssprobold' }}>{userData?.username}</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 8 }}>
          <Ionicons name='location' size={16} color={'black'} style={{ marginRight: 8 }} />
          <Text style={{ fontSize: 16, fontFamily: 'ssprosemibold', color: 'rgb(161, 161, 161)' }}>
            Bandung, Indonesia
          </Text>
        </View>
      </View>
      <View
        style={{ paddingTop: imgSize / 10 + 10, alignItems: 'center', flexDirection: 'row', paddingHorizontal: 40 }}>
        <View style={{ alignItems: 'center' }}>
          <Text style={{ fontFamily: 'ssprobold', fontSize: 24 }}>{userData?.followers?.length ?? '0'}</Text>
          <Text style={{ fontFamily: 'sspro', fontSize: 18, color: '#a2a2a2' }}>Followers</Text>
        </View>
        <View style={{ alignItems: 'center', marginLeft: 75 }}>
          <Text style={{ fontFamily: 'ssprobold', fontSize: 24 }}>{journalData.length}</Text>
          <Text style={{ fontFamily: 'sspro', fontSize: 18, color: '#a2a2a2' }}>Posts</Text>
        </View>
        <View style={{ alignItems: 'center', marginLeft: 75 }}>
          <Text style={{ fontFamily: 'ssprobold', fontSize: 24 }}>{userData?.followings?.length ?? '0'}</Text>
          <Text style={{ fontFamily: 'sspro', fontSize: 18, color: '#a2a2a2' }}>Following</Text>
        </View>
      </View>
      <View style={{ paddingTop: imgSize / 6 + 10, alignItems: 'center', flexDirection: 'row' }}>
        <View
          style={{
            alignItems: 'center',
            borderBottomColor: colors.primaryGreen,
            borderBottomWidth: screen === 'trip' ? 2 : 0,
            width: 138,
            paddingHorizontal: 35,
          }}>
          <TouchableOpacity onPress={() => setScreen('trip')}>
            <MaterialCommunityIcons
              name='airplane'
              size={36}
              color={screen === 'trip' ? colors.primaryGreen : colors.black}
            />
          </TouchableOpacity>
        </View>
        <View
          style={{
            alignItems: 'center',
            borderBottomColor: colors.primaryGreen,
            borderBottomWidth: screen === 'story' ? 2 : 0,
            width: 138,
            paddingHorizontal: 35,
          }}>
          <TouchableOpacity onPress={() => setScreen('story')}>
            <Ionicons name='grid' size={34} color={screen === 'story' ? colors.primaryGreen : colors.black} />
          </TouchableOpacity>
        </View>
        <View
          style={{
            alignItems: 'center',
            borderBottomColor: colors.primaryGreen,
            borderBottomWidth: screen === 'info' ? 2 : 0,
            width: 138,
            paddingHorizontal: 35,
          }}>
          <TouchableOpacity onPress={() => setScreen('info')}>
            <Ionicons
              name='information-circle'
              size={34}
              color={screen === 'info' ? colors.primaryGreen : colors.black}
            />
          </TouchableOpacity>
        </View>
      </View>
      <View style={{ flex: 1 }} onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
        {screen === 'info' ? (
          <View style={{ flex: 1, marginTop: 20, paddingHorizontal: 20 }}>
            <ProfileInfo
              name={userData?.name === '' ? user.username ?? '' : userData?.name ?? ''}
              age={userData?.age ?? 0}
              bio={userData?.bio ?? ''}
              gender={userData?.gender ?? ''}
            />
          </View>
        ) : null}
        {screen === 'story' ? (
          <View style={{ flex: 1, marginTop: 20, paddingBottom: 50 }}>
            <ProfileStory data={storyData} />
          </View>
        ) : null}
        {screen === 'trip' ? (
          <View style={{ flex: 1, marginTop: 20, paddingBottom: 50 }}>
            <ProfileJournal data={journalData} />
          </View>
        ) : null}
      </View>
    </View>
    // </SafeAreaView>
  );
};

export default Profile;

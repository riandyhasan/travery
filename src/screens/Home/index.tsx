import React, { useState, useCallback } from 'react';
import { View, Text } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { SCREEN_HEIGHT, SCREEN_WIDTH } from '@src/utils/deviceDimensions';
import HomeFeeds from './Feeds';
import colors from '@src/styles/colors';
import ImageView from '@src/components/ImageView';
import { useSelector } from 'react-redux';
import { RootState } from '@src/types/Root';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useSwipe } from '@src/utils/hooks';
import { StoryData } from '@src/types/Story';
import { getFriendStories, getForYouStories } from '@src/services/story';

const Home = () => {
  const user = useSelector((state: RootState) => state.user);
  const [screen, setScreen] = useState<string>('friends');
  const [friendStory, setFriendStory] = useState<StoryData[]>([]);
  const [forYouStory, setForYouStory] = useState<StoryData[]>([]);

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

  const getFriendStory = async () => {
    if (user.username) {
      const data = await getFriendStories(user.username);
      if (data !== null) {
        setFriendStory(data);
      }
    }
  };

  const getForYouStory = async () => {
    if (user.username) {
      const data = await getForYouStories(user.username);
      if (data !== null) {
        setForYouStory(data);
      }
    }
  };

  const screens = ['friends', 'foryou'];

  const { onTouchStart, onTouchEnd } = useSwipe(handleSwipeLeft, handleSwipeRight, 6);
  useFocusEffect(
    useCallback(() => {
      getFriendStory();
      getForYouStory();
    }, [])
  );
  return (
    <View style={{ flex: 1, backgroundColor: colors.white }}>
      <View
        style={{
          flexDirection: 'row',
          width: '100%',
          alignItems: 'center',
          paddingTop: SCREEN_HEIGHT * 0.05,
          paddingHorizontal: SCREEN_WIDTH * 0.05,
        }}>
        <Text style={{ fontFamily: 'ssprobold', color: colors.black, fontSize: 26 }}>Hey, </Text>
        <Text style={{ fontFamily: 'ssprobold', color: colors.primaryGreen, fontSize: 26 }}>
          {user.name !== '' ? user.name : user.username}
        </Text>
        <ImageView name='waving-hand' style={{ width: 26, height: 26 }} />
      </View>
      <View
        style={{
          flexDirection: 'row',
          width: '100%',
          alignItems: 'center',
          justifyContent: 'center',
          paddingTop: 20,
          paddingBottom: 10,
        }}>
        <TouchableOpacity
          style={{
            marginLeft: 30,
            borderBottomColor: screen === 'friends' ? colors.primaryGreen : '#c0c0c0',
            borderBottomWidth: 2,
            paddingHorizontal: 20,
          }}
          onPress={() => setScreen('friends')}>
          <Text
            style={{
              fontFamily: 'ssprosemibold',
              color: screen === 'friends' ? colors.primaryGreen : '#c0c0c0',
              fontSize: 16,
            }}>
            Friends
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={{
            marginLeft: 30,
            borderBottomColor: screen === 'foryou' ? colors.primaryGreen : '#c0c0c0',
            borderBottomWidth: 2,
            paddingHorizontal: 20,
          }}
          onPress={() => setScreen('foryou')}>
          <Text
            style={{
              fontFamily: 'ssprosemibold',
              color: screen === 'foryou' ? colors.primaryGreen : '#c0c0c0',
              fontSize: 16,
            }}>
            For You
          </Text>
        </TouchableOpacity>
      </View>
      <View style={{ flex: 1 }} onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
        {screen === 'friends' ? <HomeFeeds data={friendStory} /> : null}
        {screen === 'foryou' ? <HomeFeeds showConnect={true} data={forYouStory} /> : null}
      </View>
    </View>
  );
};

export default Home;

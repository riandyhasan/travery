import React, { useState, useRef } from 'react';
import { View, ScrollView, StyleSheet, Dimensions, Animated, Easing, Pressable } from 'react-native';
import FeedsCard from '@src/components/Cards/Feeds';
import { SCREEN_HEIGHT, SCREEN_WIDTH } from '@src/utils/deviceDimensions';
import { StoryData } from '@src/types/Story';
import { useSelector } from 'react-redux';
import { RootState } from '@src/types/Root';
import { db } from '@src/utils/firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { Octicons } from '@expo/vector-icons';

const HomeFeeds = ({ data, showConnect = false }: { data: StoryData[]; showConnect?: boolean }) => {
  const user = useSelector((state: RootState) => state.user);
  const [lastPressTime, setLastPressTime] = useState(0);
  const scaleAnimation = useRef(new Animated.Value(0)).current;
  const popupAnimation = useRef(new Animated.Value(0)).current;
  const [showAnimation, setShowAnimation] = useState<boolean>(false);
  const [activeID, setActiveID] = useState<string>('');

  const checkIfLiked = (item: StoryData) => {
    const likers = item.journalData?.likes;
    let isLiked = false;
    likers?.map((i) => {
      if (i.username === user.username) {
        isLiked = true;
      }
    });
    return isLiked;
  };

  const handleLike = async (item: StoryData) => {
    setActiveID(item.id);
    const doubleClickDelay = 300; // Define the delay threshold for a double click
    const currentTime = new Date().getTime();
    const delta = currentTime - lastPressTime;

    if (delta < doubleClickDelay) {
      if (checkIfLiked(item)) {
        setLastPressTime(0);
        setShowAnimation(true);
        Animated.parallel([
          Animated.spring(scaleAnimation, {
            toValue: 1, // Increase the scale to 1
            useNativeDriver: true, // Enable native driver for better performance
          }),
          Animated.timing(popupAnimation, {
            toValue: 1, // Increase the opacity to 1
            duration: 500, // Set the duration of the animation
            easing: Easing.ease, // Set the easing function
            useNativeDriver: true, // Enable native driver for better performance
          }),
        ]).start(() => {
          // Animation completed, reset the scale and opacity back to 0
          scaleAnimation.setValue(0);
          popupAnimation.setValue(0);
          setShowAnimation(false);
        });
        return;
      }

      // Reset the last press time
      if (item.journalData && user.username && user.avatar) {
        const newLikes = item.journalData.likes;
        const dataLike = {
          avatar: user.avatar,
          username: user.username,
        };
        newLikes.push(dataLike);
        const docRef = doc(db, `journal`, item.journalData.id);
        await updateDoc(docRef, {
          likes: newLikes,
        });

        // Start the animations
        setShowAnimation(true);
        Animated.parallel([
          Animated.spring(scaleAnimation, {
            toValue: 1, // Increase the scale to 1
            useNativeDriver: true, // Enable native driver for better performance
          }),
          Animated.timing(popupAnimation, {
            toValue: 1, // Increase the opacity to 1
            duration: 500, // Set the duration of the animation
            easing: Easing.ease, // Set the easing function
            useNativeDriver: true, // Enable native driver for better performance
          }),
        ]).start(() => {
          // Animation completed, reset the scale and opacity back to 0
          scaleAnimation.setValue(0);
          popupAnimation.setValue(0);
          setShowAnimation(false);
        });
      }

      setLastPressTime(0);
    } else {
      // Single click detected, update the last press time
      setLastPressTime(currentTime);
    }
  };

  const renderCards = () => {
    return data.map((item) => (
      <View style={styles.cardContainer} key={item.id}>
        <Pressable onPress={() => handleLike(item)}>
          <FeedsCard
            avatar={item.userData?.avatar ?? ''}
            username={item.user}
            posted={item.postedAt}
            story={item.story}
            imageUrl={item.image}
            likes={item.journalData?.likes?.length ?? 0}
            comments={item.journalData?.comments?.length ?? 0}
            isLiked={checkIfLiked(item)}
            isShowConnect={showConnect}
          />
        </Pressable>
        {showAnimation && activeID == item.id && (
          <Animated.View
            style={[
              styles.heartPopup,
              {
                transform: [{ scale: scaleAnimation }],
                opacity: popupAnimation,
              },
            ]}>
            <Octicons name='heart-fill' size={100} color={'#E74C3C'} />
          </Animated.View>
        )}
      </View>
    ));
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.row}>{renderCards()}</View>
    </ScrollView>
  );
};

const numColumns = 1.05;
const cardWidth = SCREEN_WIDTH / numColumns;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 10,
    paddingTop: 5,
    paddingBottom: 100,
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
  heartPopup: {
    position: 'absolute',
    top: SCREEN_HEIGHT * 0.2,
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 0,
  },
});

export default HomeFeeds;

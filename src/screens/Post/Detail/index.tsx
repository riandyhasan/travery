import { useState, useCallback, useRef } from 'react';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import {
  ScrollView,
  Animated,
  Easing,
  StyleSheet,
  Text,
  TextInput,
  View,
  KeyboardAvoidingView,
  Pressable,
} from 'react-native';
import ImageView from '@src/components/ImageView';
import { SCREEN_HEIGHT, SCREEN_WIDTH } from '@src/utils/deviceDimensions';
import { Octicons, MaterialIcons, AntDesign, Ionicons } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useSelector } from 'react-redux';
import { RootState } from '@src/types/Root';
import colors from '@src/styles/colors';
import { store } from '@src/redux/store';
import { resetParams } from '@src/redux/actions/params';
import { LinearGradient } from 'expo-linear-gradient';
import { JournalData, Likes, Comment } from '@src/types/Journal';
import { getDetailJournal } from '@src/services/journal';
import { StoryData } from '@src/types/Story';
import moment from 'moment';
import { db } from '@src/utils/firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { routeUser } from '@src/redux/actions/params';
import { followUser } from '@src/services/user';

const Plan = () => {
  const navigation = useNavigation();
  const scaleAnimation = useRef(new Animated.Value(0)).current;
  const popupAnimation = useRef(new Animated.Value(0)).current;
  const [showAnimation, setShowAnimation] = useState<boolean>(false);
  const user = useSelector((state: RootState) => state.user);
  const params = useSelector((state: RootState) => state.params);
  const [screen, setScreen] = useState<string>('story');
  const [journal, setJournal] = useState<JournalData>();
  const [comment, setComment] = useState<string>('');
  const [activeStory, setActiveStory] = useState<StoryData | null>();

  const formatPostedAt = (postedAt: Date) => {
    const now = moment();
    const postedMoment = moment(postedAt);

    // Calculate the difference in seconds between now and the postedAt timestamp
    const diffInSeconds = now.diff(postedMoment, 'seconds');

    // Use moment.js to format the difference in a human-readable way
    const formattedPostedAt = moment.duration(diffInSeconds, 'seconds').humanize();

    return formattedPostedAt;
  };

  const handleStalk = (username: string) => {
    if (username !== user.username) {
      store.dispatch(routeUser({ user: username }));
      navigation.navigate('UserProfile' as never);
    }
  };

  const fetchDetailJournal = async () => {
    if (params.journal_id) {
      const data = await getDetailJournal(params.journal_id);
      if (data !== null) {
        setJournal(data);
        data?.stories?.map((item: StoryData) => {
          if (params.story_id === item.id) {
            setActiveStory(item);
          }
        });
        if (activeStory == null && data?.stories) {
          data.stories.length > 0 && setActiveStory(data.stories[0]);
        }
      }
    }
  };

  const handleGoBack = () => {
    store.dispatch(resetParams());
    navigation.goBack();
  };

  const renderText = (text: string) => {
    const textWithoutNewLines = text.replace(/(\r\n|\n|\r)/gm, '');
    const shortText =
      textWithoutNewLines.length > 30 ? textWithoutNewLines.substring(0, 30) + '...' : textWithoutNewLines;

    return shortText;
  };

  useFocusEffect(
    useCallback(() => {
      fetchDetailJournal();
    }, [params])
  );

  const renderCards = () => {
    return journal?.stories?.map((item) => (
      <TouchableOpacity style={styles.cardContainer} key={item.id} onPress={() => setActiveStory(item)}>
        <View
          style={{
            flexDirection: 'row',
            width: '100%',
            paddingHorizontal: 20,
            paddingVertical: 10,
            borderRadius: 12,
            borderWidth: 2,
            borderColor: colors.primaryGreen,
            backgroundColor: activeStory?.id === item.id ? colors.primaryGreen : 'white',
          }}>
          <View>
            <ImageView
              name={'header'}
              remoteAssetFullUri={item.image}
              style={{ borderRadius: 10, width: 65, height: 65 }}
              resizeMode='cover'
            />
          </View>
          <View style={{ marginLeft: 10 }}>
            <Text
              style={{
                fontSize: 20,
                fontFamily: 'ssprobold',
              }}>
              {item.title}
            </Text>
            <Text
              style={{
                fontFamily: 'sspro',
                textAlign: 'justify',
              }}>
              {renderText(item.story)}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    ));
  };

  const checkIfLiked = () => {
    const likers = journal?.likes;
    let isLiked = false;
    likers?.map((i) => {
      if (i.username === user.username) {
        isLiked = true;
      }
    });
    return isLiked;
  };

  const handleFollowUser = async (follow: string, followavatar: string) => {
    await followUser(user.username ?? '', user.avatar ?? '', follow, followavatar);
  };

  const generateLikesUsername = () => {
    const likes = journal?.likes.length ?? 0;
    const likers: string[] = [];

    journal?.likes.forEach((item: Likes, idx: number) => {
      if (idx < 2) {
        likers.push(item.username);
      }
    });

    if (likers.length === 2 && likes > 2) {
      likers.push('and others');
    }

    return likers.join(', ');
  };

  const generateLikesAvatar = () => {
    const likers: Likes[] = [];

    journal?.likes.forEach((item: Likes, idx: number) => {
      if (idx < 3) {
        likers.push(item);
      }
    });

    return likers;
  };

  const handleAddCommet = async () => {
    if (journal && user.username) {
      const tempComment = journal.comments;
      const newComment: Comment = {
        username: user.username,
        comment: comment,
        avatar: user.avatar ?? '',
        commentAt: new Date(),
      };
      tempComment.push(newComment);
      const docRef = doc(db, `journal`, journal.id);
      await updateDoc(docRef, {
        comments: tempComment,
      });
      setComment('');
      fetchDetailJournal();
    }
  };

  const checkIsFollowers = () => {
    let follow = false;
    const followers = journal?.userData?.followers;
    followers?.map((item) => {
      if (item.username === user.username) {
        follow = true;
      }
    });
    return follow;
  };

  const handleLike = async () => {
    if (checkIfLiked()) {
      if (journal && user.username) {
        const tempLikes = journal.likes;
        const newLikes: Likes[] = [];
        tempLikes.map((item: Likes) => {
          if (item.username != user.username) {
            newLikes.push(item);
          }
        });
        const docRef = doc(db, `journal`, journal.id);
        await updateDoc(docRef, {
          likes: newLikes,
        });
      }
    } else {
      if (journal && user.username && user.avatar) {
        const newLikes = journal.likes;
        const dataLike = {
          avatar: user.avatar,
          username: user.username,
        };
        newLikes.push(dataLike);
        const docRef = doc(db, `journal`, journal.id);
        await updateDoc(docRef, {
          likes: newLikes,
        });
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
    }
    fetchDetailJournal();
  };

  const renderComments = () => {
    return journal?.comments.map((item, idx) => (
      <View style={styles.cardContainer} key={idx}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <View style={{ overflow: 'hidden' }}>
            <Pressable onPress={() => handleStalk(item.username)}>
              <ImageView
                name={'avatar'}
                remoteAssetFullUri={item.avatar}
                style={{ borderRadius: 100, width: 40, height: 40 }}
                resizeMode='cover'
              />
            </Pressable>
          </View>
          <View style={{ marginLeft: 20 }}>
            <Text style={{ fontFamily: 'ssprobold', fontSize: 18 }}>{item.username}</Text>
            <Text style={{ fontFamily: 'sspro', color: '#C0C0C0' }}>{item.comment}</Text>
          </View>
        </View>
      </View>
    ));
  };

  return (
    <KeyboardAvoidingView behavior='padding' style={{ flex: 1, backgroundColor: 'white', position: 'relative' }}>
      <View style={{ position: 'relative', zIndex: 100 }}>
        {showAnimation && (
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
          <TouchableOpacity onPress={handleGoBack} activeOpacity={0.75}>
            <MaterialIcons name='keyboard-backspace' size={32} color={colors.primaryGreen} />
          </TouchableOpacity>
          <Text style={{ color: colors.primaryGreen, fontSize: 24, fontFamily: 'ssprobold' }}>Detail Journal</Text>
          <TouchableOpacity onPress={() => null} activeOpacity={0.75} style={{ backgroundColor: 'white' }}>
            <View style={{ backgroundColor: 'white', padding: 6, borderRadius: 20 }}>
              <AntDesign name='logout' size={24} color={'white'} />
            </View>
          </TouchableOpacity>
        </View>
      </View>
      <View style={{ flex: 1, paddingTop: SCREEN_HEIGHT * 0.12, paddingHorizontal: 20 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <View style={{ overflow: 'hidden' }}>
              <Pressable onPress={() => handleStalk(journal?.userData?.username ?? '')}>
                <ImageView
                  name={'avatar'}
                  remoteAssetFullUri={journal?.userData?.avatar}
                  style={{ borderRadius: 100, width: 50, height: 50 }}
                  resizeMode='cover'
                />
              </Pressable>
            </View>
            <View style={{ marginLeft: 20 }}>
              <Pressable onPress={() => handleStalk(journal?.userData?.username ?? '')}>
                <Text style={{ fontFamily: 'ssprobold', fontSize: 18 }}>{journal?.userData?.username}</Text>
              </Pressable>
              {activeStory != null ? (
                <Text style={{ fontFamily: 'sspro', color: '#C0C0C0' }}>
                  {formatPostedAt(activeStory.postedAt)} ago
                </Text>
              ) : null}
            </View>
          </View>
          {user.username != journal?.userData?.username && !checkIsFollowers() ? (
            <TouchableOpacity
              style={{ backgroundColor: '#ECECEC', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 10 }}
              onPress={() => handleFollowUser(journal?.userData?.username ?? '', journal?.userData?.avatar ?? '')}>
              <Text style={{ fontFamily: 'ssprosemibold', color: colors.primaryGreen }}>Connect</Text>
            </TouchableOpacity>
          ) : null}
        </View>
        <View style={{ position: 'relative', overflow: 'hidden', marginTop: 15 }}>
          <ImageView
            name={'header'}
            remoteAssetFullUri={activeStory !== null ? activeStory?.image : journal?.image}
            resizeMode='cover'
            style={{
              borderRadius: 15,
              width: '100%',
              height: SCREEN_HEIGHT * 0.25,
              zIndex: 0,
            }}
          />
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 15 }}>
          <TouchableOpacity style={{ marginRight: 10 }} onPress={handleLike}>
            <Octicons
              name={checkIfLiked() ? 'heart-fill' : 'heart'}
              size={32}
              color={checkIfLiked() ? '#E74C3C' : '#C0C0C0'}
            />
          </TouchableOpacity>
          {generateLikesAvatar().map((like: Likes, idx: number) => (
            <ImageView
              name={'avatar'}
              remoteAssetFullUri={like.avatar}
              style={{
                borderRadius: 100,
                width: 20,
                height: 20,
                zIndex: 50 - 10 * idx,
                marginLeft: idx === 0 ? 0 : -10,
              }}
              resizeMode='cover'
              key={idx}
            />
          ))}
          <Text style={{ fontFamily: 'sspro', color: 'black', marginLeft: 10 }}>
            {journal?.likes.length ?? 0 > 0 ? 'Liked by ' : ''}
          </Text>
          <Text style={{ fontFamily: 'ssprosemibold', color: 'black' }}>{generateLikesUsername()}</Text>
        </View>
        <View style={{ marginTop: 15 }}>
          <LinearGradient
            colors={['#73C5B6', '#156B5D']}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1.2 }}
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              borderRadius: 10,
              paddingHorizontal: 20,
              paddingVertical: 20,
            }}>
            <TouchableOpacity
              onPress={() => setScreen('story')}
              style={{
                backgroundColor: screen === 'story' ? colors.primaryGreen : 'transparent',
                paddingHorizontal: 20,
                paddingVertical: 8,
                borderRadius: 10,
              }}>
              <Text style={{ fontFamily: 'ssprobold', fontSize: 18, color: colors.white }}>Story</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setScreen('trip')}
              style={{
                backgroundColor: screen === 'trip' ? colors.primaryGreen : 'transparent',
                paddingHorizontal: 20,
                paddingVertical: 8,
                borderRadius: 10,
              }}>
              <Text style={{ fontFamily: 'ssprobold', fontSize: 18, color: colors.white }}>Detail Trip</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setScreen('comment')}
              style={{
                backgroundColor: screen === 'comment' ? colors.primaryGreen : 'transparent',
                paddingHorizontal: 20,
                paddingVertical: 8,
                borderRadius: 10,
              }}>
              <Text style={{ fontFamily: 'ssprobold', fontSize: 18, color: colors.white }}>Comment</Text>
            </TouchableOpacity>
          </LinearGradient>
        </View>
        {screen === 'story' ? (
          <View style={{ marginTop: 15 }}>
            {activeStory != null && (
              <>
                <Text style={{ fontFamily: 'ssprobold', color: colors.primaryGreen, fontSize: 24 }}>
                  {activeStory.title}
                </Text>
                <Text style={{ fontFamily: 'sspro', color: 'black', marginTop: 10 }}>{activeStory.story}</Text>
              </>
            )}
            {journal?.stories && journal?.stories?.length > 0 && (
              <>
                <Text style={{ fontFamily: 'ssprobold', color: colors.primaryGreen, fontSize: 20, marginTop: 15 }}>
                  Gallery Photo
                </Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 15 }}>
                  {journal?.stories.map((story: StoryData, idx: number) => {
                    if (idx === 0) {
                      return (
                        <TouchableOpacity onPress={() => setActiveStory(story)} key={story.id}>
                          <ImageView
                            name={'header'}
                            remoteAssetFullUri={story.image}
                            style={{ borderRadius: 10, width: 65, height: 65 }}
                            resizeMode='cover'
                          />
                        </TouchableOpacity>
                      );
                    } else if ((journal?.stories?.length ?? 1) > 5 && idx === (journal?.stories?.length ?? 1) - 1) {
                      return (
                        <TouchableOpacity onPress={() => setActiveStory(story)} key={story.id}>
                          <View
                            style={{
                              opacity: 0.65,
                              position: 'relative',
                              justifyContent: 'center',
                              alignItems: 'center',
                            }}>
                            <ImageView
                              name={'header'}
                              remoteAssetFullUri={story.image}
                              style={{ borderRadius: 10, width: 65, height: 65, marginLeft: 10 }}
                              resizeMode='cover'
                            />
                            <Text
                              style={{
                                position: 'absolute',
                                fontFamily: 'ssprosemibold',
                                color: colors.white,
                                fontSize: 24,
                              }}>
                              {(journal?.stories?.length ?? 1) - 5}+
                            </Text>
                          </View>
                        </TouchableOpacity>
                      );
                    } else {
                      return (
                        <TouchableOpacity onPress={() => setActiveStory(story)} key={story.id}>
                          <ImageView
                            name={'header'}
                            remoteAssetFullUri={story.image}
                            style={{ borderRadius: 10, width: 65, height: 65, marginLeft: 10 }}
                            resizeMode='cover'
                          />
                        </TouchableOpacity>
                      );
                    }
                  })}
                </View>
              </>
            )}
          </View>
        ) : null}
        {screen === 'trip' ? (
          <View style={{ flex: 8, paddingBottom: 50, marginTop: 15 }}>
            <ScrollView contentContainerStyle={styles.container}>
              <View style={styles.row}>{renderCards()}</View>
            </ScrollView>
          </View>
        ) : null}
        {screen === 'comment' ? (
          <View style={{ flex: 8, paddingBottom: 80, marginTop: 15 }}>
            <ScrollView contentContainerStyle={styles.container}>
              <View style={styles.row}>{renderComments()}</View>
            </ScrollView>
            <View style={styles.commentContainer}>
              <TextInput
                style={styles.commentInput}
                placeholder='Comment on this post..'
                placeholderTextColor={colors.primaryGray}
                autoFocus={false}
                value={comment}
                onChangeText={setComment}
              />
              <TouchableOpacity onPress={handleAddCommet}>
                <Ionicons name='paper-plane-outline' size={24} color={colors.primaryGray} style={styles.commentIcon} />
              </TouchableOpacity>
            </View>
          </View>
        ) : null}
      </View>
    </KeyboardAvoidingView>
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
  commentContainer: {
    position: 'absolute',
    bottom: SCREEN_WIDTH * 0.08,
    left: 16,
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderBottomColor: '#808080',
    borderBottomWidth: 2,
    elevation: 4,
  },
  commentInput: {
    flex: 1,
    height: 36,
    paddingHorizontal: 8,
    fontSize: 16,
    color: 'black',
  },
  commentIcon: {
    marginLeft: 4,
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

export default Plan;

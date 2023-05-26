import { db } from '@src/utils/firebase';
import { collection, query, where, getDocs, DocumentData, doc, getDoc, orderBy } from 'firebase/firestore';
import { StoryData } from '@src/types/Story';
import { UserData } from '@src/types/User';
import { getUserByUsername } from './user';
import { getJournalById } from './journal';

export const getUserStories = async (username: string): Promise<StoryData[] | null> => {
  try {
    const plansRef = collection(db, 'story');
    const q = query(plansRef, where('user', '==', username));
    const querySnapshot = await getDocs(q);

    const storys: StoryData[] = [];

    querySnapshot.forEach((storyDoc) => {
      const storyData = storyDoc.data() as DocumentData;
      const dayTimestamp = storyData.day;
      const postedAtTimestamp = storyData.postedAt;

      const day = new Date(dayTimestamp.toMillis());
      const postedAt = new Date(postedAtTimestamp.toMillis());

      storys.push({ id: storyDoc.id, ...storyData, day, postedAt } as StoryData);
    });

    storys.sort((a, b) => b.postedAt.getTime() - a.postedAt.getTime());

    return storys;
  } catch (error) {
    console.error('Error fetching user plans:', error);
    return null;
  }
};

export const getFriendStories = async (username: string): Promise<StoryData[] | null> => {
  const usersRef = collection(db, 'user');
  const userQuery = query(usersRef, where('username', '==', username));
  const userQuerySnapshot = await getDocs(userQuery);

  if (userQuerySnapshot.empty) {
    // User not found
    return null;
  }

  const userDoc = userQuerySnapshot.docs[0];
  const userDocData = userDoc.data() as UserData;

  const followingUserIds = userDocData.followings.map((following) => following.username);
  followingUserIds.push(username);

  const friendStoriesRef = collection(db, 'story');
  const friendStoriesQuery = query(friendStoriesRef, where('user', 'in', followingUserIds));
  const friendStoriesQuerySnapshot = await getDocs(friendStoriesQuery);

  const friendStoriesPromises: Promise<StoryData>[] = friendStoriesQuerySnapshot.docs.map(async (storyDoc) => {
    const storyData = storyDoc.data() as DocumentData;
    const dayTimestamp = storyData.day;
    const postedAtTimestamp = storyData.postedAt;

    const day = new Date(dayTimestamp.toMillis());
    const postedAt = new Date(postedAtTimestamp.toMillis());

    const [user, journal] = await Promise.all([getUserByUsername(storyData.user), getJournalById(storyData.journal)]);

    return { id: storyDoc.id, ...storyData, day, postedAt, userData: user, journalData: journal } as StoryData;
  });

  const friendStories = await Promise.all(friendStoriesPromises);

  friendStories.sort((a, b) => b.postedAt.getTime() - a.postedAt.getTime());

  return friendStories;
};

export const getForYouStories = async (username: string): Promise<StoryData[] | null> => {
  const usersRef = collection(db, 'user');
  const userQuery = query(usersRef, where('username', '==', username));
  const userQuerySnapshot = await getDocs(userQuery);

  if (userQuerySnapshot.empty) {
    // User not found
    return null;
  }

  const userDoc = userQuerySnapshot.docs[0];
  const userDocData = userDoc.data() as UserData;

  const followingUserIds = userDocData.followings.map((following) => following.username);
  followingUserIds.push(username);

  const friendStoriesRef = collection(db, 'story');
  const friendStoriesQuery = query(friendStoriesRef, where('user', 'not-in', followingUserIds));
  const friendStoriesQuerySnapshot = await getDocs(friendStoriesQuery);

  const friendStoriesPromises: Promise<StoryData>[] = friendStoriesQuerySnapshot.docs.map(async (storyDoc) => {
    const storyData = storyDoc.data() as DocumentData;
    const dayTimestamp = storyData.day;
    const postedAtTimestamp = storyData.postedAt;

    const day = new Date(dayTimestamp.toMillis());
    const postedAt = new Date(postedAtTimestamp.toMillis());

    const [user, journal] = await Promise.all([getUserByUsername(storyData.user), getJournalById(storyData.journal)]);

    return { id: storyDoc.id, ...storyData, day, postedAt, userData: user, journalData: journal } as StoryData;
  });

  const friendStories = await Promise.all(friendStoriesPromises);

  friendStories.sort((a, b) => b.postedAt.getTime() - a.postedAt.getTime());

  return friendStories;
};

import { db } from '@src/utils/firebase';
import { collection, query, where, getDocs, DocumentData, doc, getDoc, orderBy } from 'firebase/firestore';
import { JournalData } from '@src/types/Journal';
import { getUserByUsername } from './user';
import { StoryData } from '@src/types/Story';

export const getUserJournals = async (username: string): Promise<JournalData[] | null> => {
  try {
    const plansRef = collection(db, 'journal');
    const q = query(plansRef, where('user', '==', username));
    const querySnapshot = await getDocs(q);

    const journals: JournalData[] = [];

    querySnapshot.forEach((journalDoc) => {
      const journalData = journalDoc.data() as DocumentData;
      const startDateTimestamp = journalData.startDate;
      const endDateTimestamp = journalData.endDate;

      const startDate = new Date(startDateTimestamp.toMillis());
      const endDate = new Date(endDateTimestamp.toMillis());

      journals.push({ id: journalDoc.id, ...journalData, startDate, endDate } as JournalData);
    });

    return journals;
  } catch (error) {
    console.error('Error fetching user plans:', error);
    return null;
  }
};

export const getPopularJournal = async (): Promise<JournalData[] | null> => {
  try {
    const plansRef = collection(db, 'journal');
    const querySnapshot = await getDocs(plansRef);

    const journals: JournalData[] = [];

    querySnapshot.forEach((journalDoc) => {
      const journalData = journalDoc.data() as DocumentData;
      const startDateTimestamp = journalData.startDate;
      const endDateTimestamp = journalData.endDate;

      const startDate = new Date(startDateTimestamp.toMillis());
      const endDate = new Date(endDateTimestamp.toMillis());

      journals.push({ id: journalDoc.id, ...journalData, startDate, endDate } as JournalData);
    });

    // Sort the journals based on likes count in descending order
    journals.sort((a, b) => b.likes.length - a.likes.length);

    // Sort the journals based on comments count in descending order
    journals.sort((a, b) => b.comments.length - a.comments.length);

    // Limit the journals to 10
    const popularJournals = journals.slice(0, 10);

    return popularJournals;
  } catch (error) {
    console.error('Error fetching journals:', error);
    return null;
  }
};

export const getJournalById = async (id: string): Promise<JournalData | null> => {
  try {
    const journalRef = doc(db, 'journal', id);
    const journalSnapshot = await getDoc(journalRef);

    if (!journalSnapshot.exists()) {
      return null;
    }
    const journalData = journalSnapshot.data() as DocumentData;
    const startDateTimestamp = journalData.startDate;
    const endDateTimestamp = journalData.endDate;

    const startDate = new Date(startDateTimestamp.toMillis());
    const endDate = new Date(endDateTimestamp.toMillis());

    return { id: journalSnapshot.id, ...journalData, startDate, endDate } as JournalData;
  } catch (error) {
    console.error('Error fetching user by username:', error);
    return null;
  }
};

export const getDetailJournal = async (id: string): Promise<JournalData | null> => {
  try {
    const journalRef = doc(db, 'journal', id);
    const journalSnapshot = await getDoc(journalRef);

    if (!journalSnapshot.exists()) {
      return null;
    }
    const journalData = journalSnapshot.data() as DocumentData;
    const startDateTimestamp = journalData.startDate;
    const endDateTimestamp = journalData.endDate;

    const startDate = new Date(startDateTimestamp.toMillis());
    const endDate = new Date(endDateTimestamp.toMillis());

    const user = await getUserByUsername(journalData.user);

    const stories: StoryData[] = [];
    const plansRef = collection(db, 'story');
    const q = query(plansRef, where('journal', '==', journalSnapshot.id));
    const querySnapshot = await getDocs(q);

    querySnapshot.forEach((storyDoc) => {
      const storyData = storyDoc.data() as DocumentData;
      const dayTimestamp = storyData.day;
      const postedAtTimestamp = storyData.postedAt;

      const day = new Date(dayTimestamp.toMillis());
      const postedAt = new Date(postedAtTimestamp.toMillis());

      stories.push({ id: storyDoc.id, ...storyData, day, postedAt } as StoryData);
    });

    stories.sort((a, b) => b.postedAt.getTime() - a.postedAt.getTime());

    return { id: journalSnapshot.id, ...journalData, startDate, endDate, userData: user, stories } as JournalData;
  } catch (error) {
    console.error('Error fetching user by username:', error);
    return null;
  }
};

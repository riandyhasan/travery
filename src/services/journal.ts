import { db } from '@src/utils/firebase';
import { collection, query, where, getDocs, DocumentData, doc, getDoc } from 'firebase/firestore';
import { JournalData } from '@src/types/Journal';

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

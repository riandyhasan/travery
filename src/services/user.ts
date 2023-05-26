import { db } from '@src/utils/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { UserData } from '@src/types/User';

export const getUserByUsername = async (username: string): Promise<UserData | null> => {
  try {
    const usersRef = collection(db, 'user');
    const q = query(usersRef, where('username', '==', username));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return null;
    }

    const userDoc = querySnapshot.docs[0];
    const userData = userDoc.data();

    return { id: userDoc.id, ...userData } as UserData;
  } catch (error) {
    console.error('Error fetching user by username:', error);
    return null;
  }
};

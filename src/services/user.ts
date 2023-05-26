import { db } from '@src/utils/firebase';
import { collection, query, where, getDocs, updateDoc, doc } from 'firebase/firestore';
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

export const getAllUser = async (): Promise<UserData[]> => {
  try {
    const usersRef = collection(db, 'user');
    const querySnapshot = await getDocs(usersRef);

    if (querySnapshot.empty) {
      return [];
    }

    const usersData: UserData[] = [];

    querySnapshot.forEach((userDoc) => {
      const userData = userDoc.data();
      usersData.push({ id: userDoc.id, ...userData } as UserData);
    });

    return usersData;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};

export const followUser = async (username: string, useravatar: string, follow: string, avatar: string) => {
  try {
    const usersRef = collection(db, 'user');
    const q = query(usersRef, where('username', '==', username));
    const querySnapshot = await getDocs(q);
    const r = query(usersRef, where('username', '==', follow));
    const rnapshot = await getDocs(r);

    if (querySnapshot.empty || rnapshot.empty) {
      return;
    }

    const userDoc = querySnapshot.docs[0];
    const userData = userDoc.data();

    const followDoc = rnapshot.docs[0];
    const followData = followDoc.data();

    const followings = userData.followings;
    followings.push({
      username: follow,
      avatar: avatar,
    });

    const followers = followData.followers;
    followers.push({
      username: username,
      avatar: useravatar,
    });

    const docRef = doc(db, `user`, userDoc.id);
    await updateDoc(docRef, {
      followings: followings,
    });

    const followRef = doc(db, `user`, followDoc.id);
    await updateDoc(followRef, {
      followers: followers,
    });
  } catch (error) {
    console.error('Error fetching user by username:', error);
    return;
  }
};

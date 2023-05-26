import { db } from '@src/utils/firebase';
import { collection, query, where, getDocs, DocumentData, doc, getDoc } from 'firebase/firestore';
import { PlanData } from '@src/types/Plan';

export const getUserPlans = async (user_id: string): Promise<PlanData[] | null> => {
  try {
    const plansRef = collection(db, 'plan');
    const q = query(plansRef, where('user', '==', user_id));
    const querySnapshot = await getDocs(q);

    const plans: PlanData[] = [];

    querySnapshot.forEach((planDoc) => {
      const planData = planDoc.data() as DocumentData;
      const startDateTimestamp = planData.startDate;
      const endDateTimestamp = planData.endDate;

      const startDate = new Date(startDateTimestamp.toMillis());
      const endDate = new Date(endDateTimestamp.toMillis());

      plans.push({ id: planDoc.id, ...planData, startDate, endDate } as PlanData);
    });

    plans.sort((a, b) => a.startDate.getTime() - b.startDate.getTime());

    return plans;
  } catch (error) {
    console.error('Error fetching user plans:', error);
    return null;
  }
};

export const getPlanById = async (id: string): Promise<PlanData | null> => {
  try {
    const planRef = doc(db, 'plan', id);
    const planSnapshot = await getDoc(planRef);

    if (!planSnapshot.exists()) {
      return null;
    }
    const planData = planSnapshot.data() as DocumentData;
    const startDateTimestamp = planData.startDate;
    const endDateTimestamp = planData.endDate;

    const startDate = new Date(startDateTimestamp.toMillis());
    const endDate = new Date(endDateTimestamp.toMillis());

    return { id: planSnapshot.id, ...planData, startDate, endDate } as PlanData;
  } catch (error) {
    console.error('Error fetching user by username:', error);
    return null;
  }
};

import { UserData } from './User';
import { JournalData } from './Journal';

export interface StoryData {
  id: string;
  user: string;
  title: string;
  location: string;
  image: string;
  day: Date;
  category: string;
  journalTitle: string;
  journal: string;
  story: string;
  postedAt: Date;
  userData?: UserData;
  journalData?: JournalData;
}

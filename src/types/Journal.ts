export interface Comment {
  avatar: string;
  comment: string;
  username: string;
}

export interface Likes {
  avatar: string;
  username: string;
}

export interface JournalData {
  id: string;
  user: string;
  title: string;
  location: string;
  image: string;
  startDate: Date;
  endDate: Date;
  likes: Likes[];
  comments: Comment[];
}

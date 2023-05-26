export type UserReducerAction =
  | { type: 'USER_DATA'; id: string; email: string; username: string; name: string; avatar: string }
  | { type: 'USER_LOGIN' }
  | { type: 'USER_LOGOUT' };

export interface UserReducerState {
  email?: string | null;
  id?: string | null;
  username?: string | null;
  loggedIn?: boolean | null;
  name?: string | null;
  avatar?: string | null;
}

export interface Follow {
  username: string;
  avatar: string;
}
export interface UserData {
  id: string;
  username: string;
  avatar: string;
  bio: string;
  email: string;
  age: number;
  gender: string;
  phone: string;
  name: string;
  followers: Follow[];
  followings: Follow[];
}

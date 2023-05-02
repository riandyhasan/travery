export interface SignUpReq {
  username: string;
  phone: string;
  email: string;
  password: string;
}

export interface SignInReq {
  username: string;
  password: string;
}

export interface Profile {
  username: string;
  avatar: string;
  header: string;
  location: string;
  followers: number;
  posts: number;
  following: number;
}

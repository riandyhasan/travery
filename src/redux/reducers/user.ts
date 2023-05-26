import { UserReducerAction, UserReducerState } from '@src/types/User';

const defaultState = {
  email: null,
  username: null,
  id: null,
  loggedIn: null,
  name: null,
  avatar: null,
} as UserReducerState;

const userReducer = (prevState = defaultState, action: UserReducerAction | any) => {
  switch (action.type) {
    case 'USER_DATA':
      return {
        ...prevState,
        email: action.email,
        username: action.username,
        id: action.id,
        name: action.name,
        avatar: action.avatar,
      };
    case 'USER_LOGOUT':
      return {
        ...defaultState,
      };
    default:
      return prevState;
  }
};

export default userReducer;

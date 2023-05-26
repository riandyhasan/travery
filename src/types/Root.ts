import { UserReducerState } from './User';

export interface RootState {
  user: UserReducerState;
  auth: any;
  params: any;
}

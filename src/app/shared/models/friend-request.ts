import {User} from './user';

export class FriendRequest {
  id: number;
  sender: User;
  recipient: User;
  sentTime: string;
  status: string;
}

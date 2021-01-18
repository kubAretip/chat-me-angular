import {User} from './user';

export class Message {
  id: number;
  sender: User;
  recipient: User;
  content: string;
  time: string;
  messageStatus?: string;
}

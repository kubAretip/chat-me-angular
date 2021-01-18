import {Role} from './role';

export class User {
  id: number;
  login: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  activated?: boolean;
  friendRequestCode?: string;
  roles?: Array<Role>;
}

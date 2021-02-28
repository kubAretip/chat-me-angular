import {Role} from './role';

export class User {
  id?: string;
  username?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  activated?: boolean;
  friendRequestCode?: string;
  roles?: Array<Role>;
}

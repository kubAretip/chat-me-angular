import {Role} from './role';

export class User {
  id: number;
  login: string;
  roles?: Array<Role>;
}

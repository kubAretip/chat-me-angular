import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {User} from '../models/user';

@Injectable({providedIn: 'root'})
export class UserService {

  private userResource = '/users';

  constructor(private http: HttpClient) {
  }

  activateUser(activationKey) {
    const params = new HttpParams().set('data', activationKey);
    return this.http.patch(environment.baseApiUrl + environment.authServiceResource +
      this.userResource + '/activate?' + params.toString(), {});
  }

  getUser(userId: string) {
    return this.http.get<User>(environment.baseApiUrl + environment.authServiceResource +
      this.userResource + '/' + userId);
  }

  changePassword(userId: string, newPassword) {
    return this.http.patch(environment.baseApiUrl + environment.authServiceResource +
      this.userResource + '/' + userId + '/change-password', newPassword);
  }

  modifyUserInformation(id: string, user: User) {
    return this.http.patch<User>(environment.baseApiUrl + environment.authServiceResource +
      this.userResource + '/' + id, user);
  }
}

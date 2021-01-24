import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {baseUrl} from '../../../environments/environment';
import {User} from '../models/user';

@Injectable({providedIn: 'root'})
export class AccountService {

  constructor(private http: HttpClient) {
  }

  activateUser(activationKey) {
    const params = new HttpParams()
      .set('data', activationKey);
    return this.http.patch(`${baseUrl}/accounts/activate?${params.toString()}`, {});
  }

  getUser() {
    return this.http.get<User>(`${baseUrl}/accounts`);
  }

  generateUserNewFriendCode() {
    return this.http.patch<User>(`${baseUrl}/accounts/renew-friend-code`, {});
  }

  changePassword(newPassword) {
    return this.http.patch(`${baseUrl}/accounts/change-password`, newPassword);
  }

  modifyAccountInformation(id: number, user: User) {
    return this.http.patch<User>(`${baseUrl}/accounts/${id}`, user);
  }
}

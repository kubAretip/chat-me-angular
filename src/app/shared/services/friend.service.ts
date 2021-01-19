import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {baseUrl} from '../../../environments/environment';
import {FriendRequest} from '../models/friend-request';

@Injectable({providedIn: 'root'})
export class FriendService {

  constructor(private http: HttpClient) {
  }


  getUserFriendRequests() {
    return this.http.get<FriendRequest[]>(`${baseUrl}/friends`);
  }


}

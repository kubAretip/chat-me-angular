import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {baseUrl} from '../../../environments/environment';
import {FriendRequest} from '../models/friend-request';

@Injectable({providedIn: 'root'})
export class FriendService {

  constructor(private http: HttpClient) {
  }

  getReceivedFriendRequest() {
    return this.http.get<FriendRequest[]>(`${baseUrl}/friends-request`);
  }

  getSentFriendsRequest() {
    const params = new HttpParams()
      .set('status', 'sent');
    return this.http.get<FriendRequest[]>(`${baseUrl}/friends-request?${params.toString()}`);
  }

  postCreateNewFriendRequest(invitationCode) {
    const params = new HttpParams()
      .set('invite_code', invitationCode);
    return this.http.post<FriendRequest>(`${baseUrl}/friends-request?${params.toString()}`, {});
  }

  replyToFriendsRequest(id, accept) {
    const params = new HttpParams()
      .set('accept', accept);
    return this.http.patch(`${baseUrl}/friends-request/${id}?${params.toString()}`, {});
  }


  cancelSentFriendRequest(id) {
    return this.http.delete(`${baseUrl}/friends-request/${id}`);
  }


}

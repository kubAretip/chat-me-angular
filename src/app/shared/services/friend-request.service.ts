import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {baseUrl, environment} from '../../../environments/environment';
import {FriendRequest} from '../models/friend-request';


@Injectable({providedIn: 'root'})
export class FriendRequestService {

  private friendRequestResource = '/friend-requests';

  constructor(private http: HttpClient) {
  }

  getReceivedFriendRequests() {
    return this.http
      .get<FriendRequest[]>(environment.baseApiUrl + environment.chatServiceResource + this.friendRequestResource + '/received');
  }

  getSentFriendRequests() {
    return this.http
      .get<FriendRequest[]>(environment.baseApiUrl + environment.chatServiceResource + this.friendRequestResource + '/sent');
  }

  postCreateNewFriendRequest(invitationCode) {
    const params = new HttpParams().set('invite_code', invitationCode);
    return this.http.post<FriendRequest>(environment.baseApiUrl + environment.chatServiceResource +
      this.friendRequestResource + '?' + params.toString(), {});
  }

  replyToFriendsRequest(id, accept) {
    const params = new HttpParams().set('accept', accept);
    return this.http.patch(environment.baseApiUrl + environment.chatServiceResource +
      this.friendRequestResource + '/' + id + '?' + params.toString(), {});
  }


  cancelSentFriendRequest(id) {
    return this.http.delete(environment.baseApiUrl + environment.chatServiceResource + this.friendRequestResource +
      '/' + id);
  }


}

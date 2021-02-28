import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {FriendChat} from '../models/friend-chat';

@Injectable({providedIn: 'root'})
export class FriendChatService {

  private friendChatResource = '/friends-chats';

  constructor(private http: HttpClient) {
  }


  getFriendsChats() {
    return this.http.get<FriendChat[]>(environment.baseApiUrl + environment.chatServiceResource + this.friendChatResource);
  }

  deleteFriend(chatFriendId, chatFriendWithId) {
    const params = new HttpParams()
      .set('friend_chat', chatFriendId)
      .set('friend_chat_with', chatFriendWithId);
    return this.http.delete(environment.baseApiUrl + environment.chatServiceResource + this.friendChatResource
      + '?' + params.toString());
  }

}

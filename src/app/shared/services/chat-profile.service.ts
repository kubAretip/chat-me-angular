import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {ChatProfile} from '../models/chat-profile';


@Injectable({providedIn: 'root'})
export class ChatProfileService {

  private chatProfileResource = '/chat-profiles';

  constructor(private http: HttpClient) {
  }

  getChatProfile(userId: string) {
    return this.http.get<ChatProfile>(environment.baseApiUrl + environment.chatServiceResource + this.chatProfileResource + '/' + userId);
  }

  generateNewFriendsCode(userId: string) {
    return this.http.patch<ChatProfile>(environment.baseApiUrl + environment.chatServiceResource +
      this.chatProfileResource + '/' + userId + '/new-friends-request-code', {});
  }

}

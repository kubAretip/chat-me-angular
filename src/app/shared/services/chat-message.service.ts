import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {ChatMessage} from '../models/chat-message';

@Injectable({providedIn: 'root'})
export class ChatMessageService {

  private chatMessageResource = '/chat-messages';

  constructor(private http: HttpClient) {
  }

  getLastMessages(size, friendChatId, friendChatWithId) {
    const params = new HttpParams()
      .set('friend_chat_id1', friendChatId)
      .set('friend_chat_id2', friendChatWithId)
      .set('size', size);
    return this.http.get<ChatMessage[]>(environment.baseApiUrl + environment.chatMessagesServiceResource +
      this.chatMessageResource + '?' + params.toString());
  }

  getPreviousMessages(size, friendChatId, friendChatWithId, from) {
    const params = new HttpParams()
      .set('friend_chat_id1', friendChatId)
      .set('friend_chat_id2', friendChatWithId)
      .set('size', size)
      .set('from', from);

    return this.http.get<ChatMessage[]>(environment.baseApiUrl + environment.chatMessagesServiceResource +
      this.chatMessageResource + '?' + params.toString());
  }

  markMessageAsDelivered(friendChatId) {
    const params = new HttpParams().set('friend_chat_id', friendChatId);
    return this.http.patch(environment.baseApiUrl + environment.chatMessagesServiceResource +
      this.chatMessageResource + '?' + params.toString(), {});
  }

}

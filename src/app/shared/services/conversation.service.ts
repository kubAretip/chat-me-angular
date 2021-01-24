import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Conversation} from '../models/conversation';
import {baseUrl} from '../../../environments/environment';


@Injectable({providedIn: 'root'})
export class ConversationService {

  constructor(private http: HttpClient) {
  }

  getConversation() {
    return this.http.get<Conversation[]>(`${baseUrl}/conversations`);
  }

  deleteFriendConversation(conversationId) {
    return this.http.delete(`${baseUrl}/conversations/${conversationId}`);
  }

}

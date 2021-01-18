import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {baseUrl} from '../../../environments/environment';
import {Message} from '../models/message';

@Injectable({providedIn: 'root'})
export class MessageService {

  constructor(private http: HttpClient) {
  }

  getLastMessages(size, conversationId) {
    const params = new HttpParams()
      .set('size', size)
      .set('conversation_id', conversationId);
    return this.http.get<Message[]>(`${baseUrl}/messages?${params.toString()}`);
  }

}

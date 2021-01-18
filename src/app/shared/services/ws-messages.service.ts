import {Injectable} from '@angular/core';
import {wsBaseUrl} from '../../../environments/environment';
import * as Stomp from 'stompjs';

@Injectable({providedIn: 'root'})
export class WsMessagesService {

  ws: any;

  constructor() {
  }

  connect(token, afterWebSocketConnected) {
    this.ws = Stomp.client(`${wsBaseUrl}`);
    const that = this;
    this.ws.connect({
      Authorization: 'Bearer ' + token
      // tslint:disable-next-line:only-arrow-functions
    }, function(frame) {
      afterWebSocketConnected.wsAfterConnected();
    });
  }

  sendMessage(message) {
    this.ws.send('/app/chat', {}, JSON.stringify(message));
  }

  disconnect() {
    if (this.ws != null) {
      this.ws.ws.close();
    }
    console.log('Disconnected');
  }


}

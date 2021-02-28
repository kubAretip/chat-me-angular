import {Injectable} from '@angular/core';
import {environment, wsBaseUrl} from '../../../environments/environment';
import * as Stomp from 'stompjs';

@Injectable({providedIn: 'root'})
export class WsMessagesService {

  private messagingWebsocketServiceResource = '/messages-websocket-service/ws';
  ws: any;

  constructor() {
  }

  connect(token, afterWebSocketConnected) {
    this.ws = Stomp.client(environment.websocketBaseUrl + environment.websocketMessageServiceResource + '/ws');
    this.ws.connect({
      Authorization: 'Bearer ' + token
      // tslint:disable-next-line:only-arrow-functions
    }, function(frame) {
      afterWebSocketConnected.wsAfterConnected();
    });
  }

  sendMessage(message) {
    return this.ws.send('/app/chat', {}, JSON.stringify(message));
  }

  disconnect() {
    if (this.ws != null) {
      this.ws.ws.close();
    }
  }
}

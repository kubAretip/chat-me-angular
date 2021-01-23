import {Component, Input, OnInit} from '@angular/core';
import {Conversation} from '../../../shared/models/conversation';
import {Message} from '../../../shared/models/message';
import {MessageService} from '../../../shared/services/message.service';
import {first} from 'rxjs/operators';
import {Subject} from 'rxjs';
import {AuthService} from '../../../shared/services/auth.service';

@Component({
  selector: 'app-friend',
  templateUrl: './friend.component.html',
  styleUrls: ['./friend.component.css']
})
export class FriendComponent implements OnInit {

  @Input('isNewMessage') isNewMessage: Subject<Message>;
  @Input('onClickComponent') onClickComponent: Subject<number>;
  @Input('conversation') conversation: Conversation;
  currentConversationId: number;
  lastMessage = {} as Message;

  constructor(private messageService: MessageService, private authService: AuthService) {
  }

  ngOnInit(): void {
    this.getLastMessage();
    this.isNewMessage.subscribe(newMessage => {
      if (this.conversation.id === newMessage.conversationId || this.conversation.conversationWithId === newMessage.conversationId) {
        this.lastMessage = newMessage;
      }
    });
    this.onClickComponent.subscribe(conversationId => {
      this.currentConversationId = conversationId;
      this.markMessageAsDelivered();
    });
  }

  showNotification(): boolean {
    if (this.currentConversationId === this.conversation.id) {
      return false;
    } else {
      return this.lastMessage.messageStatus === 'RECEIVED' && this.lastMessage.recipient.id === this.authService.currentUserValue.id;
    }
  }

  getLastMessage() {
    this.messageService.getLastMessages(1, this.conversation.id).pipe(first())
      .subscribe(result => {
        if (result.length !== 0) {
          this.lastMessage = result[0];
        }
      });
  }

  markMessageAsDelivered() {
    if (this.conversation.id === this.currentConversationId) {
      this.messageService.markMessageAsDelivered(this.conversation.conversationWithId).subscribe(response => {
        this.getLastMessage();
      });
    }
  }


}

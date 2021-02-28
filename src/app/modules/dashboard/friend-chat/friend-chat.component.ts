import {Component, Input, OnInit} from '@angular/core';
import {ChatMessage} from '../../../shared/models/chat-message';
import {ChatMessageService} from '../../../shared/services/chat-message.service';
import {first} from 'rxjs/operators';
import {Subject} from 'rxjs';
import {AuthService} from '../../../shared/services/auth.service';
import {FriendChat} from '../../../shared/models/friend-chat';
import {UserService} from '../../../shared/services/user.service';
import {User} from '../../../shared/models/user';
import {ChatMessagesStatus} from '../../../shared/enum/chat-messages-status';

@Component({
  selector: 'app-friend-chat',
  templateUrl: './friend-chat.component.html',
  styleUrls: ['./friend-chat.component.css']
})
export class FriendChatComponent implements OnInit {

  @Input('isNewMessage') isNewMessage: Subject<ChatMessage>;
  @Input('onClickComponent') onClickComponent: Subject<number>;
  @Input('conversation') friendChat: FriendChat;
  currentFriendChat: number;
  lastMessage = {} as ChatMessage;
  recipientUser = {} as User;

  constructor(private messageService: ChatMessageService,
              private authService: AuthService,
              private userService: UserService) {
  }

  ngOnInit(): void {
    this.getLastMessage();
    this.isNewMessage.subscribe(newMessage => {
      if (this.friendChat.id === newMessage.friendChat || this.friendChat.chatWith === newMessage.friendChat) {
        this.lastMessage = newMessage;
      }
    });
    this.onClickComponent.subscribe(friendChatId => {
      this.currentFriendChat = friendChatId;
      this.markMessageAsDelivered();
    });
    this.getRecipientUserInformation();
  }

  private getRecipientUserInformation() {
    this.userService.getUser(this.friendChat.recipient.userId)
      .subscribe(recipient => {
        this.recipientUser = recipient;
      });
  }

  showNotification(): boolean {
    if (this.currentFriendChat === this.friendChat.id) {
      return false;
    } else {
      return this.lastMessage.status === ChatMessagesStatus.received && this.lastMessage.recipient === this.authService.currentUserValue.id;
    }
  }

  getLastMessage() {
    this.messageService.getLastMessages(1, this.friendChat.id, this.friendChat.chatWith).pipe(first())
      .subscribe(result => {
        if (result.length !== 0) {
          this.lastMessage = result[0];
        }
      });
  }

  markMessageAsDelivered() {
    if (this.friendChat.id === this.currentFriendChat) {
      this.messageService.markMessageAsDelivered(this.friendChat.chatWith).subscribe(response => {
        this.getLastMessage();
      });
    }
  }


}

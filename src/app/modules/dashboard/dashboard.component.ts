import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {AuthService} from '../../shared/services/auth.service';
import {Router} from '@angular/router';
import {ConversationService} from '../../shared/services/conversation.service';
import {first} from 'rxjs/operators';
import {Conversation} from '../../shared/models/conversation';
import {MessageService} from '../../shared/services/message.service';
import {Message} from '../../shared/models/message';
import {WsMessagesService} from '../../shared/services/ws-messages.service';
import {AfterWebSocketConnected} from '../../shared/helpers/after-web-socket-connected';
import {AccountService} from '../../shared/services/account.service';
import {User} from '../../shared/models/user';
import {FriendService} from '../../shared/services/friend.service';
import {FriendRequest} from '../../shared/models/friend-request';

declare var $: any;

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, AfterWebSocketConnected {

  @ViewChild('inputMessage') inputMessage: ElementRef;
  @ViewChild('messageContainer') messageContainer: ElementRef;
  @ViewChild('inviteCode') inviteCode: ElementRef;
  @ViewChild('notification') notification: ElementRef;
  notificationMessage = '';
  activeFriendsList = true;
  activeFriendRequestList = false;
  isNotificationVisible = false;
  currentConversation: Conversation;
  newMessage: Message = null;
  conversationList: Conversation[] = [];
  friendRequestList: FriendRequest[];
  messageList: Message[];
  currentConversationId: number = null;
  user = {} as User;

  constructor(private authService: AuthService,
              private router: Router,
              private conversationService: ConversationService,
              private messageService: MessageService,
              private wsMessagesService: WsMessagesService,
              private accountService: AccountService,
              private friendService: FriendService) {
    wsMessagesService.connect(authService.getToken(), this);
  }


  ngOnInit(): void {
    this.getUserConversations();
    this.configureChatScroll();
    this.getUserInformation();
  }


  private configureChatScroll() {
    const that = this;
    // tslint:disable-next-line:only-arrow-functions
    $('.msg_history').scroll(function() {
      if ($('.msg_history').scrollTop() === 0) {
        that.previousMessages();
      }
    });
  }

  private getUserConversations() {
    this.conversationService.getConversation().pipe(first())
      .subscribe(result => {
        this.conversationList = result;
      });
  }

  previousMessages() {
    this.messageService.getPreviousMessages(10, this.currentConversation.id, this.messageList[0].time)
      .subscribe(result => {
        result.forEach(message => {
          this.messageList.unshift(message);
        });
      });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/']);
  }

  enterConversation(conversationId) {
    this.currentConversation = this.conversationList.filter(value => value.id === conversationId)[0];
    this.currentConversationId = this.currentConversation.id;
    this.messageService.getLastMessages(10, conversationId).pipe(first())
      .subscribe(result => {
        this.messageList = result;
        console.log(this.messageContainer.nativeElement.scrollHeight);
      });
  }

  sentMessage(messageContent) {
    const message = {
      sender: this.authService.currentUserValue,
      recipient: this.currentConversation.recipient,
      content: messageContent,
      conversationId: this.currentConversationId,
      time: new Date().toLocaleString().replace(',', '')
    };
    this.messageList.push(message);
    this.wsMessagesService.sendMessage(message);
    this.inputMessage.nativeElement.value = '';
    this.newMessage = message;
    this.messageContainer.nativeElement.scrollTop = this.messageContainer.nativeElement.scrollHeight;
  }

  wsAfterConnected() {
    const that = this;
    this.wsMessagesService.ws.subscribe('/user/' + this.authService.currentUserValue.id + '/queue/messages',
      // tslint:disable-next-line:only-arrow-functions
      function(message) {
        let conversationMessage: Message;
        conversationMessage = JSON.parse(message.body);
        that.newMessage = conversationMessage;
        if (conversationMessage.conversationId === that.currentConversation.conversationWithId) {
          that.messageList.push(conversationMessage);
        }
      });
  }

  showFriendRequestList() {
    this.friendService.getUserFriendRequests().subscribe(result => {
      this.friendRequestList = result;
      console.log(result);
      this.activeFriendRequestList = true;
      this.activeFriendsList = false;
    });
  }

  showFriendList() {
    this.activeFriendRequestList = false;
    this.activeFriendsList = true;
  }

  private getUserInformation() {
    this.accountService.getUser().subscribe(user => {
      this.user = user;
    });
  }

  sendFriendRequest() {
    const invitationCode = this.inviteCode.nativeElement.value;
    this.friendService.sendFriendRequest(invitationCode)
      .subscribe(result => {
        this.friendRequestList.push(result);
        this.showNotificationMessage('We send new friend invitation.');
      }, errorObject => {
        if (errorObject.status === 404 || errorObject.status === 400) {
          this.showNotificationMessage(errorObject.error.detail);
        }
      });

    this.inviteCode.nativeElement.value = '';
  }


  showNotificationMessage(message) {

    this.notificationMessage = message;
    this.isNotificationVisible = true;
    console.log(this.isNotificationVisible);
    setTimeout(() => {
      this.isNotificationVisible = false;
      console.log(this.isNotificationVisible);
    }, 2000);
  }

}

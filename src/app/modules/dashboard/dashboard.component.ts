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
import {Subject} from 'rxjs';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, AfterWebSocketConnected {

  @ViewChild('inputMessage') inputMessage: ElementRef;
  @ViewChild('friendCode') friendCode: ElementRef;
  @ViewChild('notification') notification: ElementRef;
  @ViewChild('messageContainer') messageContainer: ElementRef;
  @ViewChild('appMessage') appMessage: ElementRef;

  isNewMessage: Subject<Message> = new Subject();
  clickFriendComponent: Subject<number> = new Subject();

  notificationMessage = '';

  isActiveFriendComponent = false;
  isActiveFriendRequestComponent = false;
  isActiveAddFriendComponent = false;
  isActiveSettingsComponent = true;
  showDeleteFriendPrompt = false;
  isNotificationVisible = false;
  sentFriendsRequest: FriendRequest[] = [];
  currentUser = {} as User;
  receivedFriendsRequest: FriendRequest[] = [];
  conversationList: Conversation[] = [];
  messageList: Message[] = [];
  currentConversation: Conversation = null;
  scrollDivMessagePosition: number = null;
  private shouldScrollToBottomAfterSendMessage = false;
  private audio = new Audio();

  constructor(private authService: AuthService,
              private router: Router,
              private conversationService: ConversationService,
              private messageService: MessageService,
              private wsMessagesService: WsMessagesService,
              private accountService: AccountService,
              private friendService: FriendService) {
    wsMessagesService.connect(authService.getToken(), this);
    this.initAudioNotification();
  }

  ngOnInit(): void {
    this.getUserConversations();
    this.getUserInformation();
  }

  private getUserConversations() {
    this.conversationService.getConversation().pipe(first())
      .subscribe(result => {
        this.conversationList = result;
      });
  }

  getPreviousMessages() {
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
    this.getInitialMessages(conversationId);
    console.log(conversationId);
    this.clickFriendComponent.next(conversationId);
  }

  getInitialMessages(conversationId) {
    this.messageService.getLastMessages(10, conversationId).pipe(first())
      .subscribe(result => {
        this.messageList = result;
      });
  }

  sentMessage() {
    const message = {
      sender: this.authService.currentUserValue,
      recipient: this.currentConversation.recipient,
      content: this.inputMessage.nativeElement.value,
      conversationId: this.currentConversation.id,
      time: new Date().toLocaleString().replace(',', '')
    } as Message;
    this.messageList.push(message);
    this.wsMessagesService.sendMessage(message);
    this.inputMessage.nativeElement.value = '';
    message.messageStatus = 'DELIVERED';
    this.isNewMessage.next(message);
    this.shouldScrollToBottomAfterSendMessage = true;
  }

  scrollChatMessage() {
    // scroll to bottom after send message
    if (this.shouldScrollToBottomAfterSendMessage) {
      this.messageContainer.nativeElement.scrollTop = this.messageContainer.nativeElement.scrollHeight;
      this.shouldScrollToBottomAfterSendMessage = false;
      return;
    }

    if (this.scrollDivMessagePosition !== null && this.scrollDivMessagePosition < this.messageContainer.nativeElement.scrollHeight) {
      this.messageContainer.nativeElement.scrollTop = this.messageContainer.nativeElement.scrollHeight - this.scrollDivMessagePosition;
    } else {
      this.messageContainer.nativeElement.scrollTop = this.messageContainer.nativeElement.scrollHeight;
    }
  }

  wsAfterConnected() {
    const that = this;
    this.wsMessagesService.ws.subscribe('/user/' + this.authService.currentUserValue.id + '/queue/messages',
      // tslint:disable-next-line:only-arrow-functions
      function(message) {
        let conversationMessage: Message;
        conversationMessage = JSON.parse(message.body);
        if (that.currentConversation !== null && conversationMessage.conversationId === that.currentConversation.conversationWithId) {
          that.messageService.markMessageAsDelivered(that.currentConversation.conversationWithId).subscribe(result => {
            conversationMessage.messageStatus = 'DELIVERED';
            that.messageList.push(conversationMessage);
          });
        } else {
          that.audio.play();
        }
        that.isNewMessage.next(conversationMessage);
      });
  }

  showFriendRequestComponent() {
    this.friendService.getReceivedFriendRequest()
      .subscribe(result => {
        this.receivedFriendsRequest = result;
        this.isActiveFriendRequestComponent = true;
        this.isActiveFriendComponent = false;
        this.isActiveAddFriendComponent = false;
        this.isActiveSettingsComponent = false;
      });
  }

  showFriendComponent() {
    this.isActiveFriendComponent = true;
    this.isActiveFriendRequestComponent = false;
    this.isActiveAddFriendComponent = false;
    this.isActiveSettingsComponent = false;
    this.getUserConversations();
    this.getUserInformation();
  }

  showAddFriendComponent() {
    this.friendService.getSentFriendsRequest()
      .subscribe(result => {
        this.sentFriendsRequest = result;
        this.isActiveAddFriendComponent = true;
        this.isActiveFriendRequestComponent = false;
        this.isActiveFriendComponent = false;
        this.isActiveSettingsComponent = false;
      });
  }

  showSettingsComponent() {
    this.isActiveFriendComponent = false;
    this.isActiveFriendRequestComponent = false;
    this.isActiveAddFriendComponent = false;
    this.isActiveSettingsComponent = true;
    this.currentConversation = null;
  }

  private getUserInformation() {
    this.accountService.getUser().subscribe(user => {
      this.currentUser = user;
    });
  }

  sendFriendRequest() {
    const invitationCode = this.friendCode.nativeElement.value;
    if (invitationCode.length !== 0) {
      this.friendService.postCreateNewFriendRequest(invitationCode)
        .subscribe(result => {
          this.sentFriendsRequest.push(result);
          this.showNotificationMessage('We send a new friends request.');
        }, errorObject => {
          if (errorObject.status === 404 || errorObject.status === 400 || errorObject.status === 409) {
            console.log(errorObject);
            this.showNotificationMessage(errorObject.error.detail);
          }
        });
      this.friendCode.nativeElement.value = '';
    }
  }

  initAudioNotification() {
    this.audio.src = '../../../assets/audio/notification_sound.mp3';
    this.audio.load();
  }

  showNotificationMessage(message) {
    this.notificationMessage = message;
    this.isNotificationVisible = true;
    setTimeout(() => {
      this.isNotificationVisible = false;
    }, 2500);
  }

  onDeletedFriendsRequest(resultMessage: string) {
    this.showNotificationMessage(resultMessage);
    this.showAddFriendComponent();
  }

  onReplyFriendsRequest(resultMessage: string) {
    this.showNotificationMessage(resultMessage);
    this.showFriendRequestComponent();
  }

  onScrollMessages(event: Event) {
    // @ts-ignore
    if (event.target.scrollTop === 0) {
      // @ts-ignore
      this.scrollDivMessagePosition = event.target.scrollHeight;
      console.log(this.scrollDivMessagePosition);
      this.getPreviousMessages();
    }
  }

  deleteFriendAlert() {
    this.showDeleteFriendPrompt = true;
  }

  deleteFriend() {
    this.conversationService.deleteFriendConversation(this.currentConversation.id)
      .subscribe(result => {
        this.getUserConversations();
        this.showDeleteFriendPrompt = false;
        this.currentConversation = null;
        this.showNotificationMessage('Friend has been removed.');
      });
  }

  cancelDeleteFriend() {
    this.showDeleteFriendPrompt = false;
  }


}

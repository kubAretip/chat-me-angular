import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {AuthService} from '../../shared/services/auth.service';
import {Router} from '@angular/router';
import {first} from 'rxjs/operators';
import {ChatMessageService} from '../../shared/services/chat-message.service';
import {ChatMessage} from '../../shared/models/chat-message';
import {WsMessagesService} from '../../shared/services/ws-messages.service';
import {AfterWebSocketConnected} from '../../shared/helpers/after-web-socket-connected';
import {UserService} from '../../shared/services/user.service';
import {User} from '../../shared/models/user';
import {FriendRequestService} from '../../shared/services/friend-request.service';
import {FriendRequest} from '../../shared/models/friend-request';
import {Subject} from 'rxjs';
import {ChatProfile} from '../../shared/models/chat-profile';
import {FriendChatService} from '../../shared/services/friend-chat.service';
import {FriendChat} from '../../shared/models/friend-chat';
import {ChatProfileService} from '../../shared/services/chat-profile.service';
import {ChatMessagesStatus} from '../../shared/enum/chat-messages-status';


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

  isNewMessage: Subject<ChatMessage> = new Subject();
  clickFriendComponent: Subject<number> = new Subject();
  currentUser = {} as User;
  currentUserChatProfile = {} as ChatProfile;
  receivedFriendRequests: FriendRequest[] = [];
  sentFriendRequests: FriendRequest[] = [];
  currentRecipientUser = {} as User;
  notificationMessage = '';
  isActiveFriendComponent = true;
  isActiveFriendRequestComponent = false;
  isActiveAddFriendComponent = false;
  isActiveSettingsComponent = false;
  showDeleteFriendPrompt = false;
  isNotificationVisible = false;
  friendsChats: FriendChat[] = [];
  messageList: ChatMessage[] = [];
  currentFriendChat: FriendChat = null;
  scrollDivMessagePosition: number = null;
  private shouldScrollToBottomAfterSendMessage = false;
  private audio = new Audio();

  constructor(private authService: AuthService,
              private router: Router,
              private chatMessageService: ChatMessageService,
              private wsMessagesService: WsMessagesService,
              private userService: UserService,
              private friendRequestService: FriendRequestService,
              private chatProfileService: ChatProfileService,
              private friendChatService: FriendChatService) {
    wsMessagesService.connect(authService.getToken(), this);
    this.initAudioNotification();
  }

  ngOnInit(): void {
    this.getUserFriendsChats();
    this.getUserInformation();
    this.getUserChatProfile();
  }

  private getUserFriendsChats() {
    this.friendChatService.getFriendsChats().pipe(first())
      .subscribe(result => {
        this.friendsChats = result;
      });
  }

  getPreviousMessages() {
    this.chatMessageService.getPreviousMessages(10, this.currentFriendChat.id, this.currentFriendChat.chatWith,
      new Date(this.messageList[0].time).toISOString())
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

  enterFriendChat(friendChatId: number) {
    this.currentFriendChat = this.friendsChats.filter(value => value.id === friendChatId)[0];
    this.getInitialMessages(this.currentFriendChat.id, this.currentFriendChat.chatWith);
    this.userService.getUser(this.currentFriendChat.recipient.userId)
      .subscribe(recipient => {
        this.currentRecipientUser = recipient;
      });
    this.clickFriendComponent.next(friendChatId);
  }


  getInitialMessages(friendChatId: number, friendChatWithId: number) {
    this.chatMessageService.getLastMessages(10, friendChatId, friendChatWithId).pipe(first())
      .subscribe(lastChatMessages => {
        lastChatMessages.sort((m1, m2) => m1.time.localeCompare(m2.time));
        this.messageList = lastChatMessages;
      });
  }

  sentMessage() {
    let messageContent = this.inputMessage.nativeElement.value;
    // delete EOL
    if (messageContent.substr(messageContent.length - 1) === '\n') {
      messageContent = messageContent.slice(0, -1);
    }
    if (messageContent !== '' || 0 !== messageContent.length) {
      const message = {
        friendChat: this.currentFriendChat.id,
        sender: this.authService.currentUserValue.id,
        recipient: this.currentFriendChat.recipient.userId,
        content: messageContent,
        status: ChatMessagesStatus.received,
        time: new Date().toISOString()
      } as ChatMessage;
      this.messageList.push(message);
      this.wsMessagesService.sendMessage(message);
      this.inputMessage.nativeElement.value = '';

      this.isNewMessage.next(message);
      this.shouldScrollToBottomAfterSendMessage = true;
    } else {
      this.inputMessage.nativeElement.value = '';
    }

  }

  scrollChatMessage() {
    // scroll to bottom after send chat-message
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
    this.wsMessagesService.ws.subscribe('/topic/' + this.authService.currentUserValue.id + '.messages',
      message => {
        let chatMessage: ChatMessage;
        chatMessage = JSON.parse(message.body);
        if (that.currentFriendChat !== null && chatMessage.friendChat === that.currentFriendChat.chatWith) {
          that.chatMessageService.markMessageAsDelivered(that.currentFriendChat.chatWith).subscribe(result => {
            chatMessage.status = ChatMessagesStatus.delivered;
            that.messageList.push(chatMessage);
          });
        } else {
          that.audio.play()
            .then(_ => {
              // sound effect started
            }).catch(error => {
            // empty
          });
        }
        that.isNewMessage.next(chatMessage);
      });
  }

  showFriendRequestComponent() {
    this.friendRequestService.getReceivedFriendRequests()
      .subscribe(result => {
        this.receivedFriendRequests = result;
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
    this.getUserFriendsChats();
    this.getUserInformation();
    this.getUserChatProfile();
  }

  showAddFriendComponent() {
    this.friendRequestService.getSentFriendRequests()
      .subscribe(result => {
        this.sentFriendRequests = result;
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
    this.currentFriendChat = null;
  }

  private getUserInformation() {
    this.userService.getUser(this.authService.currentUserValue.id).subscribe(user => {
      this.currentUser = user;
    });
  }

  private getUserChatProfile() {
    this.chatProfileService.getChatProfile(this.authService.currentUserValue.id)
      .subscribe(userChatProfile => {
        this.currentUserChatProfile = userChatProfile;
      });
  }

  sendFriendRequest() {
    let invitationCode = this.friendCode.nativeElement.value;
    invitationCode = invitationCode.replace(/\s/g, '');
    if (invitationCode.length !== 0) {
      this.friendRequestService.postCreateNewFriendRequest(invitationCode)
        .subscribe(result => {
          this.sentFriendRequests.push(result);
          this.showNotificationMessage('We send a new friends request.');
        }, errorObject => {
          if (errorObject.status === 404 || errorObject.status === 400 || errorObject.status === 409) {
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
      this.getPreviousMessages();
    }
  }

  deleteFriendAlert() {
    this.showDeleteFriendPrompt = true;
  }

  deleteFriend() {
    this.friendChatService.deleteFriend(this.currentFriendChat.id, this.currentFriendChat.chatWith)
      .subscribe(result => {
        this.getUserFriendsChats();
        this.showDeleteFriendPrompt = false;
        this.currentFriendChat = null;
        this.showNotificationMessage('Friend has been removed.');
      });
  }

  cancelDeleteFriend() {
    this.showDeleteFriendPrompt = false;
  }


}

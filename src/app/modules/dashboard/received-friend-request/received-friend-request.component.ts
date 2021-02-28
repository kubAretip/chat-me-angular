import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FriendRequest} from '../../../shared/models/friend-request';
import {FriendRequestService} from '../../../shared/services/friend-request.service';
import {UserService} from '../../../shared/services/user.service';
import {User} from '../../../shared/models/user';

@Component({
  selector: 'app-received-friend-request',
  templateUrl: './received-friend-request.component.html',
  styleUrls: ['./received-friend-request.component.css']
})
export class ReceivedFriendRequestComponent implements OnInit {

  senderUser = {} as User;

  @Input('friendRequest')
  friendRequest: FriendRequest;

  @Output()
  friendsRequestReply: EventEmitter<string> = new EventEmitter<string>();

  constructor(private friendService: FriendRequestService,
              private userService: UserService) {
  }

  ngOnInit(): void {
    this.userService.getUser(this.friendRequest.sender.userId)
      .subscribe(sender => {
        this.senderUser = sender;
      });
  }

  acceptFriendsRequest() {
    this.friendService.replyToFriendsRequest(this.friendRequest.id, true)
      .subscribe(result => {
        this.friendsRequestReply.emit('Friends request has been accepted');
      });
  }

  rejectFriendsRequest() {
    this.friendService.replyToFriendsRequest(this.friendRequest.id, false)
      .subscribe(result => {
        this.friendsRequestReply.emit('Friends request has been rejected');
      });
  }

}

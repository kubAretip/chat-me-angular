import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FriendRequest} from '../../../shared/models/friend-request';
import {FriendService} from '../../../shared/services/friend.service';

@Component({
  selector: 'app-friend-request',
  templateUrl: './friend-request.component.html',
  styleUrls: ['./friend-request.component.css']
})
export class FriendRequestComponent implements OnInit {

  @Input('friendRequest')
  friendRequest: FriendRequest;

  @Output()
  friendsRequestReply: EventEmitter<string> = new EventEmitter<string>();

  constructor(private friendService: FriendService) {
  }

  ngOnInit(): void {

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

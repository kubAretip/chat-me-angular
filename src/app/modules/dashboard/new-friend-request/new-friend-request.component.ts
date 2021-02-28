import {AfterViewInit, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FriendRequestService} from '../../../shared/services/friend-request.service';
import {FriendRequest} from '../../../shared/models/friend-request';
import {UserService} from '../../../shared/services/user.service';
import {User} from '../../../shared/models/user';

@Component({
  selector: 'app-new-friend-request',
  templateUrl: './new-friend-request.component.html',
  styleUrls: ['./new-friend-request.component.css']
})
export class NewFriendRequestComponent implements OnInit {

  recipientUser = {} as User;

  @Input('friendRequest')
  friendRequest: FriendRequest = null;

  @Output()
  friendsRequestHasDeleted: EventEmitter<string> = new EventEmitter<string>();

  constructor(private friendRequestService: FriendRequestService,
              private userService: UserService) {
  }

  ngOnInit(): void {
    this.userService.getUser(this.friendRequest.recipient.userId)
      .subscribe(recipient => {
        this.recipientUser = recipient;
      });
  }

  cancelFriendRequest() {
    this.friendRequestService.cancelSentFriendRequest(this.friendRequest.id)
      .subscribe(result => {
        this.friendsRequestHasDeleted.emit('Friend request deleted.');
      });
  }

}

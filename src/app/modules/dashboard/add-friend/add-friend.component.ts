import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FriendRequest} from '../../../shared/models/friend-request';
import {FriendService} from '../../../shared/services/friend.service';

@Component({
  selector: 'app-add-friend',
  templateUrl: './add-friend.component.html',
  styleUrls: ['./add-friend.component.css']
})
export class AddFriendComponent implements OnInit {

  @Input('friendsRequest')
  friendRequest: FriendRequest = null;

  @Output()
  friendsRequestHasDeleted: EventEmitter<string> = new EventEmitter<string>();

  constructor(private friendService: FriendService) {
  }

  ngOnInit(): void {
  }

  cancelFriendRequest() {
    this.friendService.cancelSentFriendRequest(this.friendRequest.id)
      .subscribe(result => {
        this.friendsRequestHasDeleted.emit('Friends request has benn deleted.');
      });
  }

}

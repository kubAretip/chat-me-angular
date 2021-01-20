import {Component, Input, OnInit} from '@angular/core';
import {FriendRequest} from '../../../shared/models/friend-request';
import {AuthService} from '../../../shared/services/auth.service';

@Component({
  selector: 'app-friend-request',
  templateUrl: './friend-request.component.html',
  styleUrls: ['./friend-request.component.css']
})
export class FriendRequestComponent implements OnInit {

  currentUserId?: number;

  @Input('friendRequest')
  friendRequest: FriendRequest;

  constructor(private authService: AuthService) {
    this.currentUserId = this.authService.currentUserValue.id;
  }

  ngOnInit(): void {

  }

}

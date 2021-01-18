import {Component, Input, OnInit} from '@angular/core';
import {Conversation} from '../../../shared/models/conversation';

@Component({
  selector: 'app-friend',
  templateUrl: './friend.component.html',
  styleUrls: ['./friend.component.css']
})
export class FriendComponent implements OnInit {

  @Input('conversation')
  conversation: Conversation;

  @Input('conversationId')
  conversationId: number;

  constructor() {
  }

  ngOnInit(): void {

  }

}

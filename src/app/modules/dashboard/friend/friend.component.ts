import {Component, OnInit} from '@angular/core';
import {ConversationService} from '../../../shared/services/conversation.service';
import {first} from 'rxjs/operators';
import {Conversation} from '../../../shared/models/conversation';

@Component({
  selector: 'app-friend',
  templateUrl: './friend.component.html',
  styleUrls: ['./friend.component.css']
})
export class FriendComponent implements OnInit {

  conversationList: Conversation[];

  constructor(private conversationService: ConversationService) {
  }

  ngOnInit(): void {
    this.conversationService.getConversation().pipe(first())
      .subscribe(result => {
        this.conversationList = result;
      });
  }

}

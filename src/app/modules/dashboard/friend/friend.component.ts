import {AfterViewInit, Component, Input, OnInit} from '@angular/core';
import {Conversation} from '../../../shared/models/conversation';
import {Message} from '../../../shared/models/message';
import {MessageService} from '../../../shared/services/message.service';
import {first} from 'rxjs/operators';

@Component({
  selector: 'app-friend',
  templateUrl: './friend.component.html',
  styleUrls: ['./friend.component.css']
})
export class FriendComponent implements OnInit, AfterViewInit {

  @Input('conversation')
  conversation: Conversation;

  @Input('currentConversationId')
  currentConversationId: number;

  @Input('newMessage')
  newMessage: Message = null;

  lastMessage: Message;


  constructor(private messageService: MessageService) {
  }

  ngAfterViewInit(): void {

  }

  ngOnInit(): void {
    this.getLastMessage();
  }

  getLastMessage() {
    this.messageService.getLastMessages(1, this.conversation.id).pipe(first())
      .subscribe(result => {
        if (result.length !== 0) {
          this.lastMessage = result[0];
        }
      });
  }

}

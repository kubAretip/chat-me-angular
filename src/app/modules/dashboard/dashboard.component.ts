import {Component, OnInit} from '@angular/core';
import {AuthService} from '../../shared/services/auth.service';
import {Router} from '@angular/router';
import {ConversationService} from '../../shared/services/conversation.service';
import {first} from 'rxjs/operators';
import {Conversation} from '../../shared/models/conversation';
import {MessageService} from '../../shared/services/message.service';
import {Message} from '../../shared/models/message';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  conversationList: Conversation[];
  messageList: Message[];
  activeConversationId: number;


  constructor(private authService: AuthService,
              private router: Router,
              private conversationService: ConversationService,
              private messageService: MessageService) {
  }

  ngOnInit(): void {
    this.getUserConversations();
  }

  private getUserConversations() {
    this.conversationService.getConversation().pipe(first())
      .subscribe(result => {
        this.conversationList = result;
      });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/']);
  }

  enterConversation(conversationId) {
    console.log(conversationId);
    this.activeConversationId = conversationId;
    this.messageService.getLastMessages(10, conversationId).pipe(first())
      .subscribe(result => {
        this.messageList = result;
      });

  }
}

import {AfterViewInit, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ChatMessage} from '../../../shared/models/chat-message';
import {AuthService} from '../../../shared/services/auth.service';

@Component({
  selector: 'app-chat-message',
  templateUrl: './chat-message.component.html',
  styleUrls: ['./chat-message.component.css']
})
export class ChatMessageComponent implements OnInit, AfterViewInit {

  currentUserId: string;

  @Input('message')
  message: ChatMessage = null;

  @Output()
  afterRenderMessage: EventEmitter<any> = new EventEmitter<any>();

  constructor(private authService: AuthService) {
    this.currentUserId = authService.currentUserValue.id;
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.afterRenderMessage.emit();
  }

}

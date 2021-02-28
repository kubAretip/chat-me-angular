import {AfterViewInit, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Message} from '../../../shared/models/message';
import {AuthService} from '../../../shared/services/auth.service';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.css']
})
export class MessageComponent implements OnInit, AfterViewInit {

  currentUserId: string;

  @Input('message')
  message: Message = null;

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

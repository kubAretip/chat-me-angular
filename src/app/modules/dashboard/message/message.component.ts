import {Component, Input, OnInit} from '@angular/core';
import {Message} from '../../../shared/models/message';
import {AuthService} from '../../../shared/services/auth.service';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.css']
})
export class MessageComponent implements OnInit {

  currentUserId: number;

  @Input('message')
  message: Message = null;

  constructor(private authService: AuthService) {
    this.currentUserId = authService.currentUserValue.id;
  }

  ngOnInit(): void {
  }

}

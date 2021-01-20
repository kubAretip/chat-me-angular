import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {DashboardComponent} from './dashboard.component';
import {MessageComponent} from './message/message.component';
import { FriendComponent } from './friend/friend.component';
import {FormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';
import { FriendRequestComponent } from './friend-request/friend-request.component';

@NgModule({
  declarations: [
    DashboardComponent,
    MessageComponent,
    FriendComponent,
    FriendRequestComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule
  ]
})
export class DashboardModule {
}

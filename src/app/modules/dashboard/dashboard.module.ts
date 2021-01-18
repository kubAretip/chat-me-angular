import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {DashboardComponent} from './dashboard.component';
import {MessageComponent} from './message/message.component';
import { FriendComponent } from './friend/friend.component';


@NgModule({
  declarations: [
    DashboardComponent,
    MessageComponent,
    FriendComponent
  ],
  imports: [
    CommonModule
  ]
})
export class DashboardModule {
}

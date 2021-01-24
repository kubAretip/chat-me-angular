import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {DashboardComponent} from './dashboard.component';
import {MessageComponent} from './message/message.component';
import {FriendComponent} from './friend/friend.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';
import {FriendRequestComponent} from './friend-request/friend-request.component';
import {AddFriendComponent} from './add-friend/add-friend.component';
import { SettingsComponent } from './settings/settings.component';
import { AccountComponent } from './settings/account/account.component';
import { ChangePasswordComponent } from './settings/change-password/change-password.component';

@NgModule({
  declarations: [
    DashboardComponent,
    MessageComponent,
    FriendComponent,
    FriendRequestComponent,
    AddFriendComponent,
    SettingsComponent,
    AccountComponent,
    ChangePasswordComponent
  ],
    imports: [
        CommonModule,
        FormsModule,
        RouterModule,
        ReactiveFormsModule
    ]
})
export class DashboardModule {
}

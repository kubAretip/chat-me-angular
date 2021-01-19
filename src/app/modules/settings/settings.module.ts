import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SettingsComponent} from './settings.component';
import {ChangePasswordComponent} from './change-password/change-password.component';
import {AccountComponent} from './account/account.component';
import {ReactiveFormsModule} from '@angular/forms';
import {AppRoutingModule} from '../../app-routing.module';


@NgModule({
  declarations: [SettingsComponent, ChangePasswordComponent, AccountComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AppRoutingModule
  ]
})
export class SettingsModule {
}

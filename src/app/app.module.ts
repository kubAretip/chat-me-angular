import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {AppRoutingModule} from './app-routing.module';
import {SharedModule} from './shared/shared.module';
import {HomeModule} from './modules/home/home.module';
import {SignUpModule} from './modules/sign-up/sign-up.module';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {DashboardModule} from './modules/dashboard/dashboard.module';
import {TokenInterceptor} from './shared/helpers/token.interceptor';
import {SettingsComponent} from './modules/settings/settings.component';
import {SettingsModule} from './modules/settings/settings.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    SharedModule,
    HomeModule,
    SettingsModule,
    SignUpModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    DashboardModule
  ],
  providers: [
    {provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true}
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}

import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import {HomeComponent} from './modules/home/home.component';
import {NotFoundComponent} from './shared/components/not-found/not-found.component';
import {SignUpComponent} from './shared/components/sign-up/sign-up.component';
import {DashboardComponent} from './modules/dashboard/dashboard.component';
import {AuthGuard} from './shared/helpers/auth.guard';
import {SignInComponent} from './shared/components/sign-in/sign-in.component';

const routes: Routes = [

  {
    path: 'home',
    component: HomeComponent
  },
  {
    path: 'login',
    component: SignInComponent
  },
  {
    path: 'register',
    component: SignUpComponent
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard]
  },
  {
    path: '',
    pathMatch: 'full',
    component: HomeComponent
  },
  {
    path: '**',
    component: NotFoundComponent
  }

];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}

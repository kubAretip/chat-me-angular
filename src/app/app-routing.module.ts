import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import {HomeComponent} from './modules/home/home.component';
import {NotFoundComponent} from './shared/components/not-found/not-found.component';
import {SignUpComponent} from './modules/sign-up/sign-up.component';

const routes: Routes = [

  {
    path: 'home',
    component: HomeComponent
  },
  {
    path: 'login',
    component: SignUpComponent
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

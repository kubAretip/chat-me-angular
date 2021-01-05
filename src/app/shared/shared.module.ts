import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {NavBarComponent} from './components/nav-bar/nav-bar.component';
import {NotFoundComponent} from './components/not-found/not-found.component';


@NgModule({
  declarations: [NavBarComponent, NotFoundComponent],
  exports: [
    NavBarComponent, NotFoundComponent
  ],
  imports: [
    CommonModule
  ]
})
export class SharedModule {
}

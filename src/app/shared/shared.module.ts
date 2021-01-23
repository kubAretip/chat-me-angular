import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {NotFoundComponent} from './components/not-found/not-found.component';


@NgModule({
  declarations: [NotFoundComponent],
  exports: [
    NotFoundComponent
  ],
  imports: [
    CommonModule
  ]
})
export class SharedModule {
}

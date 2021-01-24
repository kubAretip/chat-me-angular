import {Component, EventEmitter, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {

  displayAccountSettings = true;
  displayPasswordSettings = false;

  @Output()
  onSettingsOperation: EventEmitter<string> = new EventEmitter<string>();

  constructor() {
  }

  ngOnInit(): void {
  }


  accountSettings() {
    this.displayAccountSettings = true;
    this.displayPasswordSettings = false;
  }

  passwordSettings() {
    this.displayAccountSettings = false;
    this.displayPasswordSettings = true;
  }

  onChangePasswordRequest($event: string) {
    this.onSettingsOperation.emit($event);
  }
}

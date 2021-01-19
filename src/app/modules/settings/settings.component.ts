import {Component, OnInit} from '@angular/core';
import {AuthService} from '../../shared/services/auth.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {
  displayAccountSettings = true;
  displayPasswordSettings = false;

  constructor(private authService: AuthService) {
  }

  ngOnInit(): void {
  }

  logout() {
    this.authService.logout();
  }

  accountSettings() {
    this.displayAccountSettings = true;
    this.displayPasswordSettings = false;
  }

  passwordSettings() {
    this.displayAccountSettings = false;
    this.displayPasswordSettings = true;
  }
}

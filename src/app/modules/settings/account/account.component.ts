import {Component, OnInit} from '@angular/core';
import {User} from '../../../shared/models/user';
import {AuthService} from '../../../shared/services/auth.service';
import {AccountService} from '../../../shared/services/account.service';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent implements OnInit {

  user: User;

  constructor(private authService: AuthService,
              private accountService: AccountService) {
  }

  ngOnInit(): void {
    this.accountService.getUser().subscribe(result => {
      this.user = result;
    });
  }

  generateNewFriendCode() {
    this.accountService.generateUserNewFriendCode().subscribe(result => {
      this.user.friendRequestCode = result.friendRequestCode;
    });
  }

}

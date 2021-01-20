import {Component, OnInit} from '@angular/core';
import {User} from '../../../shared/models/user';
import {AuthService} from '../../../shared/services/auth.service';
import {AccountService} from '../../../shared/services/account.service';
import {FormGroup} from '@angular/forms';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent implements OnInit {

  accountFormGroup: FormGroup;
  user = {} as User;

  constructor(private authService: AuthService,
              private accountService: AccountService) {
  }

  ngOnInit(): void {
    this.accountService.getUser().subscribe(result => {
      this.user = result;
    });
    this.initForm();
  }

  initForm() {
    this.accountFormGroup = new FormGroup({});
  }

  generateNewFriendCode() {
    this.accountService.generateUserNewFriendCode().subscribe(result => {
      this.user.friendRequestCode = result.friendRequestCode;
    });
  }

}

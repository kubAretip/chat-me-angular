import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthService} from '../../shared/services/auth.service';
import {AccountService} from '../../shared/services/account.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit {

  afterRegistration = false;
  afterActivation = false;
  currentUrl = '';

  constructor(private router: Router,
              private activatedRoute: ActivatedRoute,
              private authService: AuthService,
              private accountService: AccountService) {

    if (this.authService.currentUserValue) {
      this.router.navigate(['/dashboard']);
    }
  }

  ngOnInit(): void {
    this.activatedRoute.url.subscribe(value => {
      this.currentUrl = value[0].path;
    });

    this.activatedRoute.queryParams.subscribe(param => {
      if (param.registration) {
        this.afterRegistration = true;
      }
      if (param.data) {
        this.activateAccount(param.data);
      }

    });

  }

  activateAccount(activationKey) {
    this.accountService.activateUser(activationKey).subscribe(result => {
      this.router.navigate(['/login']);
      this.afterActivation = true;
    }, error => {
      console.log(error);
    });
  }

}

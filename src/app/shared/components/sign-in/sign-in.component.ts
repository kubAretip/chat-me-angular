import {Component, OnInit} from '@angular/core';
import {AuthService} from '../../services/auth.service';
import {ActivatedRoute, Router} from '@angular/router';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {UserService} from '../../services/user.service';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css']
})
export class SignInComponent implements OnInit {

  notificationMessage = '';
  loginForm: FormGroup;
  showLoginSpinner = false;

  constructor(private authService: AuthService,
              private router: Router,
              private accountService: UserService,
              private activatedRoute: ActivatedRoute,) {
    if (this.authService.currentUserValue) {
      this.router.navigate(['/dashboard']);
    }
  }

  ngOnInit(): void {
    this.initLoginForm();

    this.activatedRoute.queryParams.subscribe(param => {
      if (param.data) {
        this.activateAccount(param.data);
      }
      if (param.registration) {
        this.notificationMessage = 'Please check our mail box and confirm your email address.';
      }
      if (param.activation) {
        this.notificationMessage = 'Email confirmed. You can log in.';
      }
    });

  }

  loginProcess() {
    if (this.loginForm.valid) {
      this.showLoginSpinner = true;
      this.authService.login(this.login.value, this.password.value)
        .subscribe(result => {
          this.showLoginSpinner = false;
          this.router.navigate(['/dashboard']);
        }, errorResponse => {
          this.showLoginSpinner = false;
          this.login.reset();
          this.password.reset();
          this.notificationMessage = JSON.parse(JSON.stringify(errorResponse)).error.details;
        });
    }
  }

  private initLoginForm() {
    this.loginForm = new FormGroup({
      login: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required])
    });
  }

  activateAccount(activationKey) {
    this.accountService.activateUser(activationKey).subscribe(result => {
      this.router.navigate(['/login'], {queryParams: {activation: 'success'}});
    });
  }

  get login() {
    return this.loginForm.get('login');
  }

  get password() {
    return this.loginForm.get('password');
  }

}

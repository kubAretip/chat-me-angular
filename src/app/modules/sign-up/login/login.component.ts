import {Component, Input, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {AuthService} from '../../../shared/services/auth.service';
import {Router} from '@angular/router';
import {first} from 'rxjs/operators';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  @Input('afterRegistration')
  afterRegistration: boolean;

  @Input('afterActivation')
  afterActivation: boolean;

  loginForm: FormGroup;
  error = '';

  constructor(private authService: AuthService,
              private router: Router) {
    if (this.authService.currentUserValue) {
      this.router.navigate(['/dashboard']);
    }
  }

  ngOnInit(): void {
    this.initLoginForm();
  }

  initLoginForm() {
    this.loginForm = new FormGroup({
      login: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required])
    });
  }

  loginProcess() {
    if (this.loginForm.valid) {
      this.authService.login(this.loginForm.value)
        .pipe(first())
        .subscribe(result => {
          this.router.navigate(['/dashboard']);
        }, errorResponse => {
          this.loginForm.controls['password'].setValue('');
          this.loginForm.controls['password'].reset();
          this.error = JSON.parse(JSON.stringify(errorResponse)).error.details;
        });
    }
  }

}

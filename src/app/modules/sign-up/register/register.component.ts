import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {AuthService} from '../../../shared/services/auth.service';
import {Router} from '@angular/router';
import {first} from 'rxjs/operators';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  registerForm: FormGroup;
  error = '';
  passwordValidationError = '';
  emailValidationError = '';

  constructor(private authService: AuthService,
              private router: Router) {
    if (this.authService.currentUserValue) {
      this.router.navigate(['/dashboard']);
    }
  }

  ngOnInit(): void {
    this.initRegisterForm();
  }

  initRegisterForm() {
    this.registerForm = new FormGroup({
      login: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required]),
      firstName: new FormControl('', [Validators.required]),
      lastName: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required]),
      confirmPassword: new FormControl('', [Validators.required]),
    });
  }

  registerProcess() {
    if (this.registerForm.valid && this.isConfirmPasswordAreTheSameAsPassword()) {
      this.authService.register({
        login: this.registerForm.get('login').value,
        password: this.registerForm.get('password').value,
        firstName: this.registerForm.get('firstName').value,
        lastName: this.registerForm.get('lastName').value,
        email: this.registerForm.get('email').value
      })
        .pipe(first())
        .subscribe(result => {
          this.router.navigate(['/login'], {queryParams: {registration: 'success'}});
        }, errorObject => {

          if (errorObject.status === 400) {
            const violationsErrors = errorObject.error.violations;
            violationsErrors.forEach(error => {
              if (error.field === 'password') {
                this.registerForm.controls['password'].setValue('');
                this.registerForm.controls['confirmPassword'].reset();
                this.passwordValidationError = error.message;
                this.registerForm.controls['password'].setErrors({'validation': true});
              }
              if (error.field === 'email') {

                this.emailValidationError = error.message;
                this.registerForm.controls['email'].setErrors({'validation': true});
              }
            });
          }
          if (errorObject.status === 409) {
            this.error = errorObject.error.detail;
          }

        });
    } else {
      this.error = 'Please fill all records.';
    }
  }

  isConfirmPasswordAreTheSameAsPassword() {

    if (this.registerForm.get('password').value === this.registerForm.get('confirmPassword').value) {
      return true;
    } else {
      return false;
    }

  }


}

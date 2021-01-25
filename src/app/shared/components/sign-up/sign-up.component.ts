import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {AuthService} from '../../services/auth.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit {

  showLoadingSpinner = false;
  notificationMessage = '';
  registrationForm: FormGroup;
  confirmPasswordValidationError = '';
  passwordValidationError = '';
  emailValidationError = '';

  constructor(private authService: AuthService,
              private router: Router) {
    if (this.authService.currentUserValue) {
      this.router.navigate(['/dashboard']);
    }
  }

  ngOnInit(): void {
    this.initRegistrationForm();
  }

  private initRegistrationForm() {
    this.registrationForm = new FormGroup({
      login: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required]),
      firstName: new FormControl('', [Validators.required]),
      lastName: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required]),
      confirmPassword: new FormControl('', [Validators.required]),
    });
  }


  processRegistration() {
    this.resetFormErrors();
    if (!this.isConfirmPasswordAreTheSameAsPassword()) {
      this.confirmPasswordValidationError = 'Passwords not match';
      return;
    }

    if (this.registrationForm.valid) {
      this.showLoadingSpinner = true;

      this.authService.register({
        login: this.login.value,
        password: this.password.value,
        firstName: this.firstName.value,
        lastName: this.lastName.value,
        email: this.email.value
      }).subscribe(result => {
        this.showLoadingSpinner = false;
        this.router.navigate(['/login'], {queryParams: {registration: 'success'}});
      }, errorObject => {
        this.showLoadingSpinner = false;
        if (errorObject.status === 400) {
          const violationsErrors = errorObject.error.violations;
          violationsErrors.forEach(error => {
            if (error.field === 'password') {
              this.password.setValue('');
              this.confirmPassword.reset();
              this.passwordValidationError = error.message;
              this.password.setErrors({validation: true});
            }
            if (error.field === 'email') {
              this.emailValidationError = error.message;
              this.email.setErrors({validation: true});
            }
          });
        }

        if (errorObject.status === 409) {
          this.notificationMessage = errorObject.error.detail;
        }
      });
    }
  }

  resetFormErrors() {
    this.confirmPasswordValidationError = '';
    this.passwordValidationError = '';
    this.emailValidationError = '';
    this.notificationMessage = '';
  }


  isConfirmPasswordAreTheSameAsPassword() {
    return this.password.value === this.confirmPassword.value;
  }

  get login() {
    return this.registrationForm.get('login');
  }

  get email() {
    return this.registrationForm.get('email');
  }

  get firstName() {
    return this.registrationForm.get('firstName');
  }

  get lastName() {
    return this.registrationForm.get('lastName');
  }

  get password() {
    return this.registrationForm.get('password');
  }

  get confirmPassword() {
    return this.registrationForm.get('confirmPassword');
  }

}

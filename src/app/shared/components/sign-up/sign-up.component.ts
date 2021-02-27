import {Component, OnInit} from '@angular/core';
import {AbstractControl, FormControl, FormGroup, Validators} from '@angular/forms';
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
      username: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required]),
      firstName: new FormControl('', [Validators.required]),
      lastName: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required]),
      confirmPassword: new FormControl('', [Validators.required]),
    });
  }


  processRegistration() {
    this.resetNotificationError();
    if (!this.isConfirmPasswordAreTheSameAsPassword()) {
      this.setViolationsError(this.confirmPassword, 'Passwords not match');
      return;
    }

    if (this.registrationForm.valid) {
      this.showLoadingSpinner = true;

      this.authService.register({
        username: this.username.value,
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
              this.setViolationsError(this.password, error.message);
            }
            if (error.field === 'email') {
              this.setViolationsError(this.email, error.message);
            }
            if (error.field === 'username') {
              this.setViolationsError(this.username, error.message);
            }
            if (error.field === 'firstName') {
              this.setViolationsError(this.firstName, error.message);
            }
            if (error.field === 'lastName') {
              this.setViolationsError(this.lastName, error.message);
            }
          });
        }
        if (errorObject.status === 409) {
          this.notificationMessage = errorObject.error.detail;
        }
      });
    }
  }

  setViolationsError(control: AbstractControl, error: string) {
    if (control.getError('violations')) {
      control.setErrors({violations: control.getError('violations') + '<br>' + error});
    } else {
      control.setErrors({violations: error});
    }
  }

  resetNotificationError() {
    this.notificationMessage = '';
  }

  isConfirmPasswordAreTheSameAsPassword() {
    return this.password.value === this.confirmPassword.value;
  }

  get username() {
    return this.registrationForm.get('username');
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

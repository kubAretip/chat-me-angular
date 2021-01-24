import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {AccountService} from '../../../../shared/services/account.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit {

  changePasswordForm: FormGroup;
  newPasswordValidationError = '';
  currentPasswordValidationError = '';
  confirmNewPasswordValidationError = '';

  @Output() onChangePasswordRequest: EventEmitter<string> = new EventEmitter<string>();

  constructor(private accountService: AccountService) {

  }

  ngOnInit(): void {
    this.initLoginForm();
  }

  saveNewPassword() {

    if (this.changePasswordForm.valid) {

      if (this.newPassword.value !== this.confirmNewPassword.value) {
        this.newPassword.reset();
        this.confirmNewPassword.setErrors({validation: true});
        this.confirmNewPasswordValidationError = 'Password not match';
        return;
      }

      this.accountService.changePassword(
        {
          currentPassword: this.currentPassword.value,
          newPassword: this.newPassword.value
        }).subscribe(result => {
        this.onChangePasswordRequest.emit('Password changed');
        this.currentPassword.reset();
        this.confirmNewPassword.reset();
        this.newPassword.reset();
      }, errorObject => {
        if (errorObject.status === 400) {
          const violationsErrors = errorObject.error.violations;
          if (violationsErrors) {
            violationsErrors.forEach(error => {
              if (error.field === 'newPassword') {
                this.newPassword.setValue('');
                this.confirmNewPassword.reset();
                this.newPassword.setErrors({validation: true});
                this.newPasswordValidationError = error.message;
              }
            });
          }

          const messageDetailsError = errorObject.error.detail;
          if (messageDetailsError) {
            this.currentPassword.setValue('');
            this.currentPassword.setErrors({validation: true});
            this.currentPasswordValidationError = messageDetailsError;
            this.newPassword.reset();
            this.confirmNewPassword.reset();
          }

        }

      });
    }
  }

  initLoginForm() {
    this.changePasswordForm = new FormGroup({
      currentPassword: new FormControl('', [Validators.required]),
      newPassword: new FormControl('', [Validators.required]),
      confirmNewPassword: new FormControl('', [Validators.required])
    });
  }

  get currentPassword() {
    return this.changePasswordForm.get('currentPassword');
  }

  get newPassword() {
    return this.changePasswordForm.get('newPassword');
  }

  get confirmNewPassword() {
    return this.changePasswordForm.get('confirmNewPassword');
  }

}

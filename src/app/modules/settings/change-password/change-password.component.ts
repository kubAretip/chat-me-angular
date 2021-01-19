import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {AccountService} from '../../../shared/services/account.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit {

  changePasswordForm: FormGroup;
  newPasswordValidationError = '';
  currentPasswordValidationError = '';

  constructor(private accountService: AccountService) {

  }

  ngOnInit(): void {
    this.initLoginForm();
  }

  saveNewPassword() {
    if (this.changePasswordForm.valid) {
      this.accountService.changePassword(
        {
          currentPassword: this.changePasswordForm.get('currentPassword').value,
          newPassword: this.changePasswordForm.get('newPassword').value
        }).subscribe(result => {
        console.log(result);
      }, errorObject => {
        console.log(errorObject);
        if (errorObject.status === 400) {
          const violationsErrors = errorObject.error.violations;
          if (violationsErrors) {
            violationsErrors.forEach(error => {
              if (error.field === 'newPassword') {
                this.changePasswordForm.controls['newPassword'].setValue('');
                this.changePasswordForm.controls['confirmNewPassword'].reset();
                this.changePasswordForm.controls['newPassword'].setErrors({'validation': true});
                this.newPasswordValidationError = error.message;
              }
            });
          }

          const messageDetailsError = errorObject.error.detail;
          if (messageDetailsError) {
            this.changePasswordForm.controls['currentPassword'].setValue('');
            this.changePasswordForm.controls['currentPassword'].setErrors({'validation': true});
            this.currentPasswordValidationError = messageDetailsError;
            this.changePasswordForm.controls['newPassword'].reset();
            this.changePasswordForm.controls['confirmNewPassword'].reset();
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

}

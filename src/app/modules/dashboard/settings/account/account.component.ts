import {Component, ElementRef, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {User} from '../../../../shared/models/user';
import {AuthService} from '../../../../shared/services/auth.service';
import {UserService} from '../../../../shared/services/user.service';
import {ChatProfile} from '../../../../shared/models/chat-profile';
import {ChatProfileService} from '../../../../shared/services/chat-profile.service';


@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent implements OnInit {

  @ViewChild('firstName') firstName: ElementRef;
  @ViewChild('lastName') lastName: ElementRef;

  firstNameValidationError: string = null;
  lastNameValidationError: string = null;
  user = {} as User;
  chatProfile = {} as ChatProfile;

  @Output() onChangeAccountInformationRequest: EventEmitter<string> = new EventEmitter<string>();

  constructor(private authService: AuthService,
              private accountService: UserService,
              private chatProfileService: ChatProfileService) {
  }

  ngOnInit(): void {
    this.accountService.getUser(this.authService.currentUserValue.id).subscribe(result => {
      this.user = result;
    });

    this.chatProfileService.getChatProfile(this.authService.currentUserValue.id)
      .subscribe(result => {
        this.chatProfile = result;
      });

  }

  generateNewFriendsCode() {
    this.chatProfileService.generateNewFriendsCode(this.authService.currentUserValue.id)
      .subscribe(result => {
        this.chatProfile = result;
      });
  }

  saveAccountsChanges() {

    this.accountService.modifyUserInformation(this.authService.currentUserValue.id,
      {
        firstName: this.firstName.nativeElement.value,
        lastName: this.lastName.nativeElement.value
      }).subscribe(result => {
      this.firstName.nativeElement.value = result.firstName;
      this.lastName.nativeElement.value = result.lastName;
      this.firstNameValidationError = null;
      this.lastNameValidationError = null;
      this.onChangeAccountInformationRequest.emit('Information successfully updated');
    }, errorObject => {

      if (errorObject.status === 400) {
        const violationsErrors = errorObject.error.violations;
        if (violationsErrors) {
          violationsErrors.forEach(error => {
            if (error.field === 'firstName') {
              this.firstNameValidationError = error.message;
            }
            if (error.field === 'lastName') {
              this.lastNameValidationError = error.message;
            }
          });
        }
      }
    });
  }


}

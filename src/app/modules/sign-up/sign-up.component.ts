import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {AuthService} from '../../shared/services/auth.service';
import {first} from 'rxjs/operators';
import {Router} from '@angular/router';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit {

  loginForm: FormGroup;
  error: '';

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
        }, error => {
          console.log(error);
        });
    }
  }
}

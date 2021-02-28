import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {map} from 'rxjs/operators';
import {User} from '../models/user';
import {JwtHelperService} from '@auth0/angular-jwt';
import {WsMessagesService} from './ws-messages.service';
import {environment} from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {


  private currentUserSubject: BehaviorSubject<User>;
  public currentUser: Observable<User>;

  constructor(private http: HttpClient, private wsMessagesService: WsMessagesService) {
    this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('user')));
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): User {
    return this.currentUserSubject.value;
  }

  getToken() {
    return localStorage.getItem('access_token');
  }

  login(credentialLogin, credentialPassword): Observable<any> {
    const helper = new JwtHelperService();

    return this.http.post(environment.baseApiUrl + environment.authServiceResource + `/authenticate`, {
      username: credentialLogin,
      password: credentialPassword
    })
      .pipe(map(result => {
        const accessToken = JSON.parse(JSON.stringify(result)).access_token;
        const decodedToken = helper.decodeToken(accessToken);
        const user = {
          id: decodedToken.sub
        };
        localStorage.setItem('access_token', accessToken);
        localStorage.setItem('user', JSON.stringify(user));
        this.currentUserSubject.next(user);
        return result;
      }));
  }

  register(data): Observable<any> {
    return this.http.post(environment.baseApiUrl + environment.authServiceResource + `/users`, data);
  }

  logout() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
    this.wsMessagesService.disconnect();
    this.currentUserSubject.next(null);
  }

}

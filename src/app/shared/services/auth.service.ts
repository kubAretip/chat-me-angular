import {Injectable} from '@angular/core';
import {baseUrl} from '../../../environments/environment';
import {BehaviorSubject, Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {map} from 'rxjs/operators';
import {User} from '../models/user';
import {JwtHelperService} from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private currentUserSubject: BehaviorSubject<User>;
  public currentUser: Observable<User>;

  constructor(private http: HttpClient) {
    this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('user')));
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): User {
    return this.currentUserSubject.value;
  }

  login(data): Observable<any> {
    const helper = new JwtHelperService();

    return this.http.post(`${baseUrl}/api/authenticate`, data)
      .pipe(map(result => {
        const accessToken = JSON.parse(JSON.stringify(result)).access_token;
        const decodedToken = helper.decodeToken(accessToken);
        const user = {
          login: decodedToken.sub,
          id: decodedToken.subId
        };
        localStorage.setItem('token', accessToken);
        localStorage.setItem('token_type', decodedToken.typ);
        localStorage.setItem('user', JSON.stringify(user));
        this.currentUserSubject.next(user);
        return result;
      }));
  }

  logout() {
    console.log('logout');
    localStorage.removeItem('token');
    localStorage.removeItem('token_type');
    this.currentUserSubject.next(null);
  }

}

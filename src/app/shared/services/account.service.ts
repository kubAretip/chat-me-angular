import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {baseUrl} from '../../../environments/environment';

@Injectable({providedIn: 'root'})
export class AccountService {

  constructor(private http: HttpClient) {
  }

  activateUser(activationKey) {
    const params = new HttpParams()
      .set('data', activationKey);

    return this.http.post(`${baseUrl}/accounts/activate?${params.toString()}`, {});
  }


}

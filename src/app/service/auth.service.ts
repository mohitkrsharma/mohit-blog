import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:5000/api/auth';
  constructor(public http: HttpClient) { }

  register(params: object) {
    return this.http.post(this.apiUrl + '/register', params);
  }

  login(params: object) {
    return this.http.post(this.apiUrl + '/login', params);
  }
}

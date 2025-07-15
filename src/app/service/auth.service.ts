import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:5000/api/auth';
  userSubject = new BehaviorSubject<any>(null);
  userSubject$ = this.userSubject.asObservable();

  constructor(public http: HttpClient) {
    // Initialize with stored user data if available
    this.initializeUserFromStorage();
  }

  private initializeUserFromStorage(): void {
    const storedUserInfo = localStorage.getItem('UserInfo');
    if (storedUserInfo) {
      try {
        const parsedUserInfo = JSON.parse(storedUserInfo);
        this.userSubject.next(parsedUserInfo);
      } catch (error) {
        console.error('Error parsing stored user info:', error);
        localStorage.removeItem('UserInfo');
      }
    }
  }

  register(params: object) {
    return this.http.post(this.apiUrl + '/register', params);
  }

  login(params: object) {
    return this.http.post(this.apiUrl + '/login', params);
  }

  logout(): void {
    this.userSubject.next(null);
    localStorage.removeItem('UserInfo');
    localStorage.removeItem('auth_token');
  }

  isAuthenticated(): boolean {
    return this.userSubject.value !== null;
  }
}

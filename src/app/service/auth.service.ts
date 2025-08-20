import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:5000/api/auth';
  userSubject = new BehaviorSubject<any>(null);
  userSubject$ = this.userSubject.asObservable();

  constructor(private http: HttpClient) {
    // Initialize with stored user data if available
    this.initializeUserFromStorage();
  }

  private initializeUserFromStorage(): void {
    const storedUserInfo = sessionStorage.getItem('UserInfo');
    if (storedUserInfo) {
      try {
        const parsedUserInfo = JSON.parse(storedUserInfo);
        this.userSubject.next(parsedUserInfo);
      } catch (error) {
        console.error('Error parsing stored user info:', error);
        sessionStorage.removeItem('UserInfo');
      }
    }
  }

  register(params: object) {
    return this.http.post(this.apiUrl + '/register', params);
  }

  login(params: object) {
    return this.http.post(this.apiUrl + '/login', params);
  }

  resetPassword(params: { newPassword: string; confirmNewPassword?: string }) {
    const token = sessionStorage.getItem('auth_token');
    const headers = token
      ? new HttpHeaders({
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        })
      : new HttpHeaders({ 'Content-Type': 'application/json' });

    return this.http.put(this.apiUrl + '/reset-password', params, { headers });
  }

  // Token-based: verify reset token and get email
  verifyResetToken(token: string) {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.get(this.apiUrl + `/reset-password/${token}`, { headers });
  }

  // Token-based: reset password with token
  resetPasswordWithToken(token: string, params: { email: string; newPassword: string; confirmNewPassword?: string }) {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.put(this.apiUrl + `/reset-password/${token}`, params, { headers });
  }

  // Request password reset email
  forgotPassword(email: string) {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post(this.apiUrl + '/forgot-password', { email }, { headers });
  }
}

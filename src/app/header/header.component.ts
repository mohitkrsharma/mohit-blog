import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../service/auth.service';
import { Subscription } from 'rxjs';
import {MatToolbar} from '@angular/material/toolbar';
import {MatIcon} from '@angular/material/icon';
import {MatButton} from '@angular/material/button';
import {NgIf} from '@angular/common';
import {MatTooltip} from '@angular/material/tooltip';

@Component({
  selector: 'app-header',
  imports: [
    MatToolbar,
    MatIcon,
    MatButton,
    NgIf,
    MatTooltip
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit, OnDestroy {
  userData: any;
  private userSubscription!: Subscription;

  constructor(private router: Router, private authService: AuthService) {
  }

  ngOnInit(): void {
    // Subscribe to the user subject to listen for changes
    this.userSubscription = this.authService.userSubject$.subscribe(user => {
      this.userData = user;
    });

    // Also check if there's stored user data on page refresh
    const storedUserInfo = localStorage.getItem('UserInfo');
    if (storedUserInfo && !this.userData) {
      const parsedUserInfo = JSON.parse(storedUserInfo);
      this.authService.userSubject.next(parsedUserInfo);
    }
  }

  ngOnDestroy(): void {
    // Clean up subscription to prevent memory leaks
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }

  login(){
    this.router.navigate(['/login']);
  }

  navigateToLanding() {
    this.router.navigate(['/']);
  }

  logout() {
    // Clear user data and localStorage
    this.authService.userSubject.next(null);
    localStorage.removeItem('UserInfo');
    localStorage.removeItem('auth_token');
    this.router.navigate(['/login']);
  }
}

import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {NgIf} from '@angular/common';
import {MatCardContent} from '@angular/material/card';
import {MatButton} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';
import {MatError} from '@angular/material/input';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-login-register',
  imports: [
    ReactiveFormsModule,
    NgIf,
    MatButton,
    MatCardContent,
    MatError,
    MatIcon
  ],
  templateUrl: './login-register.component.html',
  styleUrl: './login-register.component.scss'
})
export class LoginRegisterComponent implements OnInit{
  loginForm: FormGroup;
  registerationForm: FormGroup;
  forgotPasswordForm: FormGroup;
  error: string = '';
  pageName: string = 'login';
  previewUrl: string | ArrayBuffer | null = null;
  errorMessage = '';

  constructor(private fb: FormBuilder,private router: Router,private snackBar: MatSnackBar) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });

    this.registerationForm = this.fb.group({
      fname: ['', Validators.required],
      lname: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      confirm_email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      confirm_password: ['', Validators.required]
    });

    this.registerationForm = this.fb.group({
      f_name: ['', Validators.required],
      l_name: ['', Validators.required],
      reg_email: ['', [Validators.required, Validators.email]],
      reg_re_email: ['', [Validators.required, Validators.email]],
      reg_password: ['', Validators.required],
      reg_re_password: ['', Validators.required]
    })

    this.forgotPasswordForm = this.fb.group({
      f_email: ['', [Validators.required, Validators.email]]
    })
  }

  ngOnInit(): void {
    const currentUrl = this.router.url;
    if (currentUrl.includes('register')) {
      this.pageName = 'register';
    } else if (currentUrl.includes('login')) {
      this.pageName = 'login';
    }
    else if (currentUrl.includes('forgot-password')) {
      this.pageName = 'forgot-password';
    }
   }

  onSubmit(): void {
    if (this.loginForm.valid) {
      console.log(this.loginForm.value);
      // Handle login logic
    }
  }

  register() {
    this.router.navigate(['/register']);
  }

  login() {
    this.router.navigate(['/login']);
  }

  forgotPassword(){
    this.router.navigate(['/forgot-password']);
  }

  onFileSelected($event: Event) {
    const input = $event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (!file) return;

    const validTypes: string[] = ['image/jpeg', 'image/png'];

    if (!validTypes.includes(file.type)) {
      this.errorMessage = 'Only .jpg, .jpeg, and .png formats are allowed.';
      this.previewUrl = null;
      this.snackBar.open(this.errorMessage, 'Close', {duration: 3000});
      return;
    }

    this.errorMessage = '';
    const reader = new FileReader();
    reader.onload = () => {
      this.previewUrl = reader.result as string | ArrayBuffer | null;
    };
    reader.readAsDataURL(file);
  }
}

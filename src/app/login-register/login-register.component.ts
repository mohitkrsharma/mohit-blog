import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {NgIf} from '@angular/common';
import {MatCardContent} from '@angular/material/card';
import {MatButton} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';
import {MatError} from '@angular/material/input';
import {MatSnackBar} from '@angular/material/snack-bar';
import {AuthService} from '../service/auth.service';
import {ToastrService} from 'ngx-toastr';

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
  registrationForm: FormGroup;
  forgotPasswordForm: FormGroup;
  error: string = '';
  pageName: string = 'login';
  previewUrl: string | ArrayBuffer | null = null;
  errorMessage = '';
  fileName: string = '';
  selectedFile: File | null = null;
  isSubmitting: boolean = false;

  constructor(private fb: FormBuilder,
              private router: Router,
              private snackBar: MatSnackBar,
              private authService: AuthService,
              private toastr: ToastrService) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });

    this.registrationForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      reg_re_email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
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

    this.fileName = file.name;
    this.selectedFile = file;

    const validTypes: string[] = ['image/jpeg', 'image/png'];

    if (!validTypes.includes(file.type)) {
      this.errorMessage = 'Only .jpg, .jpeg, and .png formats are allowed.';
      this.previewUrl = null;
      this.selectedFile = null;
      this.snackBar.open(this.errorMessage, 'Close', {duration: 3000});
      return;
    }

    this.errorMessage = '';
    const reader = new FileReader();
    reader.onload = () => {
      this.previewUrl = reader.result as string | ArrayBuffer | null;
    };
    reader.readAsDataURL(file);
    $event.preventDefault();
  }

  registerUser() {
    // Prevent multiple submissions
    if (this.isSubmitting) {
      return;
    }

    if (this.registrationForm.valid) {
      const formValues = this.registrationForm.value;

      if (formValues.email !== formValues.reg_re_email) {
        this.snackBar.open('Email addresses do not match', 'Close', {duration: 3000});
        return;
      }

      if (formValues.password !== formValues.reg_re_password) {
        this.snackBar.open('Passwords do not match', 'Close', {duration: 3000});
        return;
      }

      // Check if profile image is uploaded
      if (!this.selectedFile) {
        this.snackBar.open('Please upload a profile image', 'Close', {duration: 3000});
        return;
      }

      // Create FormData object to send both form values and file
      const formData = new FormData();

      // Add form values to FormData
      formData.append('firstName', formValues.firstName);
      formData.append('lastName', formValues.lastName);
      formData.append('email', formValues.email);
      formData.append('password', formValues.password);

      // Add profile picture
      formData.append('profilePic', this.selectedFile, this.fileName);

      // Set submitting flag to prevent multiple submissions
      this.isSubmitting = true;

      this.authService.register(formData).subscribe(
        (response: any) => {
          debugger;
          this.toastr.success('Success!', response.message);
          this.router.navigate(['/login']);
          this.isSubmitting = false;
        },
        (error: any) => {
          this.toastr.error('Error!', error.error.message);
          this.isSubmitting = false;
        }
      );
    } else {
      this.snackBar.open('Please fill all required fields correctly', 'Close', {duration: 3000});
    }
  }
}

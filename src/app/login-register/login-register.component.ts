import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors} from '@angular/forms';
import {Router} from '@angular/router';
import {NgIf} from '@angular/common';
import {MatSnackBar} from '@angular/material/snack-bar';
import {AuthService} from '../service/auth.service';
import {ToastrService} from 'ngx-toastr';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login-register',
  imports: [
    ReactiveFormsModule,
    NgIf,
    CommonModule
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
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      reg_re_email: ['', [Validators.required, Validators.email]],
      password: ['', [
        Validators.required,
        Validators.minLength(8),
        this.passwordStrengthValidator
      ]],
      reg_re_password: ['', [Validators.required]]
    }, {
      validators: [this.passwordsMatchValidator, this.emailsMatchValidator]
    });

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

  authenticate(): void {
    if (this.loginForm.valid) {
      this.authService.login(this.loginForm.value).subscribe(
        (response: any) => {
          this.authService.userSubject.next(response);
          sessionStorage.setItem('UserInfo', JSON.stringify(response));
          sessionStorage.setItem('auth_token', response.token);
          this.toastr.success('Success!', response.message);
          this.router.navigate(['/']);
        },
        (error: any) => {
          this.authService.userSubject.next(null);
          this.toastr.error('Error!', error.error.message);
          this.router.navigate(['/login']).then(() =>{} );
        }
      );
    }
  }

  register() {
    this.router.navigate(['/register']).then(() =>{} );
  }

  login() {
    this.router.navigate(['/login']).then(() =>{} );
  }

  forgotPassword(){
    // Navigation to forgot password page from login view
    this.router.navigate(['/forgot-password']).then(() =>{} );
  }

  onForgotPasswordSubmit(): void {
    if (this.forgotPasswordForm.invalid) {
      this.toastr.error('Please enter a valid email');
      return;
    }

    const email = this.forgotPasswordForm.get('f_email')?.value;
    this.isSubmitting = true;

    this.authService.forgotPassword(email).subscribe({
      next: (response: any) => {
        const msg = response?.message || 'Password reset email sent';
        this.toastr.success('Success!', msg);
        this.isSubmitting = false;
        this.forgotPasswordForm.reset();
        // Optionally navigate back to login after request
        this.router.navigate(['/login']).then(() =>{} );
      },
      error: (error: any) => {
        const msg = error?.error?.message || 'Failed to send password reset email';
        this.toastr.error('Error!', msg);
        this.isSubmitting = false;
      }
    });
  }

  registerUser(): void {
  if (this.isSubmitting) return;

  // Mark all fields as touched to show validation errors
  this.registrationForm.markAllAsTouched();

  if (this.registrationForm.invalid) {
    this.toastr.error('Please fix all validation errors before submitting');
    return;
  }

  this.isSubmitting = true;

  const formData = this.registrationForm.value;

  // Call registration API
  this.authService.register(formData).subscribe({
    next: (response) => {
      this.toastr.success('Registration successful!');
      this.router.navigate(['/login']);
      this.isSubmitting = false;
    },
    error: (error) => {
      this.toastr.error(error?.error?.message || 'Registration failed');
      this.isSubmitting = false;
    }
  });
}
private passwordStrengthValidator = (control: AbstractControl): ValidationErrors | null => {
  const password = control.value;

  if (!password) {
    return null; // Let required validator handle empty values
  }

  const errors: ValidationErrors = {};

  // Check minimum length
  if (password.length < 8) {
    errors['minLength'] = true;
  }

  // Check for at least one uppercase letter
  if (!/[A-Z]/.test(password)) {
    errors['uppercase'] = true;
  }

  // Check for at least one lowercase letter
  if (!/[a-z]/.test(password)) {
    errors['lowercase'] = true;
  }

  // Check for at least one number
  if (!/[0-9]/.test(password)) {
    errors['number'] = true;
  }

  // Check for at least one special character
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    errors['specialChar'] = true;
  }

  // Check for common weak passwords
  const weakPasswords = ['password', '12345678', 'qwerty', 'abc123'];
  if (weakPasswords.some(weak => password.toLowerCase().includes(weak))) {
    errors['weakPassword'] = true;
  }

  return Object.keys(errors).length > 0 ? errors : null;
};
private passwordsMatchValidator = (group: AbstractControl): ValidationErrors | null => {
  const password = group.get('password')?.value;
  const confirmPassword = group.get('reg_re_password')?.value;

  if (password && confirmPassword && password !== confirmPassword) {
    return { passwordsMismatch: true };
  }
  return null;
};
private emailsMatchValidator = (group: AbstractControl): ValidationErrors | null => {
  const email = group.get('email')?.value;
  const confirmEmail = group.get('reg_re_email')?.value;

  if (email && confirmEmail && email !== confirmEmail) {
    return { emailsMismatch: true };
  }
  return null;
};

// Check if password has specific error
hasPasswordError(errorType: string): boolean {
  const passwordControl = this.registrationForm.get('password');
  return !!(passwordControl?.hasError(errorType) && passwordControl?.touched);
}

// Check if passwords match
get passwordsMismatch(): boolean {
  return !!(this.registrationForm.hasError('passwordsMismatch') &&
            this.registrationForm.get('reg_re_password')?.touched);
}

// Get password strength percentage
getPasswordStrength(): number {
  const password = this.registrationForm.get('password')?.value || '';
  let strength = 0;

  if (password.length >= 8) strength += 20;
  if (/[A-Z]/.test(password)) strength += 20;
  if (/[a-z]/.test(password)) strength += 20;
  if (/[0-9]/.test(password)) strength += 20;
  if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) strength += 20;

  return strength;
}

// Get password strength label
getPasswordStrengthLabel(): string {
  const strength = this.getPasswordStrength();
  if (strength < 40) return 'Weak';
  if (strength < 80) return 'Medium';
  return 'Strong';
}
}

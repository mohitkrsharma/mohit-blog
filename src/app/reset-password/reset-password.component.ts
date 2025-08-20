import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { NgIf, CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../service/auth.service';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf, CommonModule],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.scss'
})
export class ResetPasswordComponent implements OnInit {
  resetForm: FormGroup;
  isSubmitting = false;
  token: string | null = null;
  loadingToken = false;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar,
    private authService: AuthService,
    private toastr: ToastrService
  ) {
    this.resetForm = this.fb.group({
      email: [{ value: '', disabled: true }, [Validators.required, Validators.email]],
      newPassword: ['', [Validators.required, Validators.minLength(8), this.passwordStrengthValidator]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: this.passwordsMatchValidator });
  }

  ngOnInit(): void {
    this.token = this.route.snapshot.paramMap.get('token');
    const emailFromQuery = this.route.snapshot.queryParamMap.get('email');

    if (this.token) {
      // If we have email from query params, use it directly
      if (emailFromQuery) {
        this.resetForm.get('email')?.setValue(decodeURIComponent(emailFromQuery));
        this.loadingToken = false;
      } else {
        // Token-based flow: verify token and fetch email
        this.loadingToken = true;
        this.authService.verifyResetToken(this.token).subscribe({
          next: (res: any) => {
            const email = res?.email || res?.data?.email || '';
            this.resetForm.get('email')?.setValue(email);
            this.loadingToken = false;
          },
          error: (err: any) => {
            this.loadingToken = false;
            this.toastr.error('Invalid or expired reset link');
            this.router.navigate(['/login']);
          }
        });
      }
    } else {
      // Logged-in flow (no token): try to prefill email from session if available
      try {
        const stored = sessionStorage.getItem('UserInfo');
        if (stored) {
          const parsed = JSON.parse(stored);
          const email = parsed?.data?.email || parsed?.email || '';
          if (email) this.resetForm.get('email')?.setValue(email);
        }
      } catch {
      }
    }
  }

  // Password strength validator (similar to register component)
  private passwordStrengthValidator = (control: AbstractControl): ValidationErrors | null => {
    const password = control.value;
    if (!password) return null;
    const errors: ValidationErrors = {};
    if (password.length < 8) errors['minLength'] = true;
    if (!/[A-Z]/.test(password)) errors['uppercase'] = true;
    if (!/[a-z]/.test(password)) errors['lowercase'] = true;
    if (!/[0-9]/.test(password)) errors['number'] = true;
    if (!/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>\/?]/.test(password)) errors['specialChar'] = true;
    const weakPasswords = ['password', '12345678', 'qwerty', 'abc123'];
    if (weakPasswords.some(weak => password.toLowerCase().includes(weak))) {
      errors['weakPassword'] = true;
    }
    return Object.keys(errors).length > 0 ? errors : null;
  };

  // Custom validator to ensure newPassword and confirmPassword match
  private passwordsMatchValidator = (group: AbstractControl): ValidationErrors | null => {
    const newPassword = group.get('newPassword')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    if (newPassword && confirmPassword && newPassword !== confirmPassword) {
      return { passwordsMismatch: true };
    }
    return null;
  };

  submit(): void {
    if (this.isSubmitting) return;

    // Mark as touched to display errors
    this.resetForm.markAllAsTouched();

    if (this.resetForm.invalid) {
      this.snackBar.open('Please fix validation errors', 'Close', { duration: 3000 });
      return;
    }

    const { email, newPassword, confirmPassword } = this.resetForm.getRawValue();

    this.isSubmitting = true;

    if (this.token) {
      // Token-based reset
      this.authService.resetPasswordWithToken(this.token, { email, newPassword, confirmNewPassword: confirmPassword }).subscribe({
        next: (response: any) => {
          this.toastr.success('Success!', response?.message || 'Password updated successfully');
          this.resetForm.reset();
          this.isSubmitting = false;
          this.router.navigate(['/login']);
        },
        error: (error: any) => {
          this.toastr.error('Error!', error?.error?.message || 'Failed to update password');
          this.isSubmitting = false;
        }
      });
    } else {
      // Logged-in user reset
      this.authService.resetPassword({ newPassword, confirmNewPassword: confirmPassword }).subscribe({
        next: (response: any) => {
          this.toastr.success('Success!', response?.message || 'Password updated successfully');
          this.resetForm.reset();
          this.isSubmitting = false;
          this.router.navigate(['/login']);
        },
        error: (error: any) => {
          this.toastr.error('Error!', error?.error?.message || 'Failed to update password');
          this.isSubmitting = false;
        }
      });
    }
  }
}

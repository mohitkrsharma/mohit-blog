import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { NgIf } from '@angular/common';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../service/auth.service';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.scss'
})
export class ResetPasswordComponent {
  resetForm: FormGroup;
  isSubmitting = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private snackBar: MatSnackBar,
    private authService: AuthService,
    private toastr: ToastrService
  ) {
    this.resetForm = this.fb.group({
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(6)]]
    }, { validators: this.passwordsMatchValidator });
  }

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

    const newPwdCtrl = this.resetForm.get('newPassword');
    const confirmPwdCtrl = this.resetForm.get('confirmPassword');

    if (newPwdCtrl?.hasError('minlength') || confirmPwdCtrl?.hasError('minlength')) {
      this.snackBar.open('Password must be at least 6 characters', 'Close', { duration: 3000 });
      return;
    }

    if (this.resetForm.invalid) {
      this.snackBar.open('Please fill all required fields correctly', 'Close', { duration: 3000 });
      return;
    }

    const { newPassword, confirmPassword } = this.resetForm.value;

    if (newPassword !== confirmPassword) {
      this.snackBar.open('Passwords do not match', 'Close', { duration: 3000 });
      return;
    }

    this.isSubmitting = true;

    // Call API to reset the password for logged-in user
    this.authService.resetPassword({ newPassword, confirmNewPassword: confirmPassword }).subscribe({
      next: (response: any) => {
        this.toastr.success('Success!', response?.message || 'Password updated successfully');
        this.resetForm.reset();
        this.isSubmitting = false;
        this.router.navigate(['/']);
      },
      error: (error: any) => {
        this.toastr.error('Error!', error?.error?.message || 'Failed to update password');
        this.resetForm.reset();
        this.isSubmitting = false;
      }
    });
  }
}

import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {NgIf} from '@angular/common';

@Component({
  selector: 'app-login-register',
  imports: [
    ReactiveFormsModule,
    NgIf
  ],
  templateUrl: './login-register.component.html',
  styleUrl: './login-register.component.scss'
})
export class LoginRegisterComponent implements OnInit{
  loginForm: FormGroup;
  registerationForm: FormGroup;
  error: string = '';
  pageName: string = 'login';

  constructor(private fb: FormBuilder,private router: Router) {
    const currentUrl = this.router.url;
    if (currentUrl.includes('register')) {
      console.log('URL contains register');
      this.pageName = 'register';
    } else if (currentUrl.includes('login')) {
      console.log('URL contains login');
      this.pageName = 'login';
    }
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
  }

  ngOnInit(): void {
   }

  onSubmit(): void {
    if (this.loginForm.valid) {
      console.log(this.loginForm.value);
      // Handle login logic
    }
  }

  register() {
    debugger;
    this.router.navigate(['/register']);
  }
}

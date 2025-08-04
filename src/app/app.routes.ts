import { Routes } from '@angular/router';
import {LandingComponent} from './landing/landing.component';
import {CreateBlogComponent} from './create-blog/create-blog.component';
import {LoginRegisterComponent} from './login-register/login-register.component';
import {authGuard} from './guard/auth.guard';
import {ShowBlogComponent} from './show-blog/show-blog.component';

export const routes: Routes = [
  {path:'', component: LandingComponent},
  {path:'user/:id/create-blog', component: CreateBlogComponent, canActivate: [authGuard]},
  {path: 'login', component: LoginRegisterComponent},
  {path: 'register', component: LoginRegisterComponent},
  {path: 'forgot-password', component: LoginRegisterComponent},
  {path: 'user/:id/edit-blog', component: CreateBlogComponent, canActivate: [authGuard]},
  {path: 'user/:userId/blog/:blogId', component: ShowBlogComponent, canActivate: [authGuard]}
];

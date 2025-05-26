import { Routes } from '@angular/router';
import {LandingComponent} from './landing/landing.component';
import {CreateBlogComponent} from './create-blog/create-blog.component';

export const routes: Routes = [
  {path:'', component: LandingComponent},
  {path:':id/create-blog', component: CreateBlogComponent}
];

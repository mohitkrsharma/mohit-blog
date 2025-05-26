import { Component } from '@angular/core';
import {MatLabel} from '@angular/material/form-field';
import {FormsModule} from '@angular/forms';
import {MatButton} from '@angular/material/button';

@Component({
  selector: 'app-create-blog',
  imports: [
    FormsModule,
    MatButton
  ],
  templateUrl: './create-blog.component.html',
  styleUrl: './create-blog.component.scss'
})
export class CreateBlogComponent {
  title: any;
  content: any;

}

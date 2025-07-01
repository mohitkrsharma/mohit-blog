import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {
  MatCard,
  MatCardActions,
  MatCardAvatar,
  MatCardContent,
  MatCardHeader,
  MatCardImage,
  MatCardSubtitle,
  MatCardTitle
} from '@angular/material/card';
import {FormControl, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatIcon} from '@angular/material/icon';
import {MatDialogModule} from '@angular/material/dialog';

@Component({
  selector: 'app-landing',
  imports: [
    CommonModule,
    MatCardActions,
    MatCardContent,
    MatCardSubtitle,
    MatCardTitle,
    MatCardHeader,
    MatCard,
    MatCardImage,
    ReactiveFormsModule,
    FormsModule,
    MatIcon,
    MatDialogModule
  ],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.scss'
})
export class LandingComponent implements OnInit {
  protected readonly Date = Date;
  blogFormControl!: FormControl;
  searchBlogInput: any;

  constructor() {
  }

  ngOnInit(): void {
    this.blogFormControl = new FormControl('');
  }

  searchBlog(searchBlogInput: any) {

  }
}

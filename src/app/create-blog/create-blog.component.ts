import {Component, OnInit} from '@angular/core';
import {ToastrModule, ToastrService} from 'ngx-toastr';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatButton} from '@angular/material/button';
import {Router} from '@angular/router';
import {NgIf} from '@angular/common';
import {MatIcon} from '@angular/material/icon';
import {MatSnackBar} from '@angular/material/snack-bar';
import {BlogService} from '../service/blog.service';

@Component({
  selector: 'app-create-blog',
  imports: [
    FormsModule,
    MatButton,
    ToastrModule,
    NgIf,
    MatIcon,
    ReactiveFormsModule
  ],
  templateUrl: './create-blog.component.html',
  styleUrl: './create-blog.component.scss'
})
export class CreateBlogComponent implements OnInit{
  title: any;
  content: any;
  pageName!: string;
  previewUrl: string | ArrayBuffer | null = null;
  errorMessage = '';
  createEditBlogForm!: FormGroup;
  constructor(private toastr: ToastrService,private router: Router,
              private snackBar: MatSnackBar,private fb: FormBuilder,
              private blogService: BlogService) {
    this.createEditBlogForm = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(60)]],
      content: ['', [Validators.required, Validators.maxLength(2000)]]
    });
  }

  ngOnInit(): void {
    const currentUrl = this.router.url;
    if (currentUrl.includes('create-blog')) {
      this.pageName = 'create-blog';
    } else if (currentUrl.includes('edit-blog')) {
      this.pageName = 'edit-blog';
    }
    else {
      this.pageName = 'create-blog';
    }
  }

  // Add validation before submitting
  createBlog() {
    if (this.createEditBlogForm.valid) {
      let payload = {
        title: this.createEditBlogForm.value.title,
        content: this.createEditBlogForm.value.content
      }
      this.blogService.createBlog(payload).subscribe({
        next: (response: any) => {
          console.log(response);
          this.toastr.success('Success!', 'Blog created successfully!');
          this.createEditBlogForm.reset();
        },
        error: (error: any) => {
          console.error(error);
          this.toastr.error('Error!', error?.error?.message || 'Something went wrong');
          this.createEditBlogForm.reset();
        },
        complete: () => {
          console.log('Blog creation request completed.');
        }
      });
    } else {
      this.snackBar.open('Please check your input and try again', 'Close', {duration: 3000});
    }
  }

  editBlog() {
    if (this.createEditBlogForm.valid) {
      this.toastr.success('Success!', 'Blog edited successfully!');
    } else {
      this.snackBar.open('Please check your input and try again', 'Close', {duration: 3000});
    }
  }
}

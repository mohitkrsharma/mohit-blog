import {Component, OnInit} from '@angular/core';
import {ToastrService} from 'ngx-toastr';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatButton} from '@angular/material/button';
import {Router} from '@angular/router';

import {MatIcon} from '@angular/material/icon';
import {MatSnackBar} from '@angular/material/snack-bar';
import {BlogService} from '../service/blog.service';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-create-blog',
  imports: [
    FormsModule,
    MatButton,
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
  blogId: string = '';
  createEditBlogForm!: FormGroup;
  constructor(private toastr: ToastrService,private router: Router,
              private snackBar: MatSnackBar,private fb: FormBuilder,
              private blogService: BlogService,
              private route: ActivatedRoute) {
    this.createEditBlogForm = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(60)]],
      content: ['', [Validators.required, Validators.maxLength(2000)]]
    });
    this.blogId = this.route.snapshot.paramMap.get('blog-id') || '';
  }

  ngOnInit(): void {
    const currentUrl = this.router.url;
    if (currentUrl.includes('create-blog')) {
      this.pageName = 'create-blog';
    } else if (currentUrl.includes('edit-blog')) {
      this.pageName = 'edit-blog';
      this.getBlogContent(this.blogId);
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
      this.blogService.createBlog(payload).subscribe(() => {
        this.toastr.success('Success!', 'Blog created successfully!');
        setTimeout(() => {
          this.createEditBlogForm.reset();
        }, 1000); // 1 second delay to ensure toastr is visible
      }, (error: any) => {
        console.error(error);
        this.toastr.error('Error!', error?.error?.message || 'Something went wrong');
        setTimeout(() => {
          this.createEditBlogForm.reset();
        }, 1000); // 1 second delay to ensure toastr is visible
      })
    } else {
      this.snackBar.open('Please check your input and try again', 'Close', {duration: 3000});
    }
  }

  updateBlog() {
    if (this.createEditBlogForm.valid) {
      this.blogService.updateBlogById(this.blogId, this.createEditBlogForm.value).subscribe(() => {
        this.toastr.success('Success!', 'Blog edited successfully!');
        this.router.navigate(['/']);
      },(error:any)=>{
        console.error(error);
        this.toastr.error('Error!', error?.error?.message || 'Something went wrong');
      })
    } else {
      this.snackBar.open('Please check your input and try again', 'Close', {duration: 3000});
    }
  }

  navigateToLanding() {
    this.router.navigate(['/']);
  }

  getBlogContent(blogId: string) {
    this.blogService.getBlogById(blogId).subscribe(
      (response: any) => {
        const data = response?.data || response; // support either shape
        if (data) {
          this.createEditBlogForm.patchValue({
            title: data.title ?? '',
            content: data.content ?? ''
          });
        }
      },
      (error: any) => {
        console.error(error);
      }
    );
  }
}

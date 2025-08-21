import {Component, OnInit, HostListener} from '@angular/core';
import {CommonModule} from '@angular/common';
import {
  MatCard,
  MatCardActions,
  MatCardContent,
  MatCardHeader,
  MatCardImage,
  MatCardTitle
} from '@angular/material/card';
import {FormControl, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatIcon} from '@angular/material/icon';
import {MatDialog, MatDialogModule} from '@angular/material/dialog';
import {ConfirmationDialogComponent} from '../confirmation-dialog/confirmation-dialog.component';
import {ToastrService} from 'ngx-toastr';
import {BlogService} from '../service/blog.service';
import {MatTooltip} from '@angular/material/tooltip';
import {Router} from '@angular/router';
import {MatInput} from '@angular/material/input';
import {MatInputModule} from '@angular/material/input';
@Component({
  selector: 'app-landing',
  imports: [
    CommonModule,
    MatCardActions,
    MatCardContent,
    MatCardTitle,
    MatCardHeader,
    MatCard,
    MatCardImage,
    ReactiveFormsModule,
    FormsModule,
    MatIcon,
    MatDialogModule,
    MatTooltip,
    MatInput,
    MatInputModule
  ],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.scss'
})
export class LandingComponent implements OnInit {
  protected readonly Date = Date;
  blogFormControl!: FormControl;
  searchBlogInput: any;
  blogs: any = { data: [], pagination: null };
  userInfo:any;
  page = 1;
  limit = 10;
  isLoading = false;
  hasMore = true;
  private bottomThreshold = 200; // px before bottom to trigger

  constructor(private dialog: MatDialog,private toastr: ToastrService, private blogService: BlogService,private router: Router) {
  }

  ngOnInit(): void {
    this.blogFormControl = new FormControl('');
    this.loadNextPage();
    this.getUserInfo();
  }

  searchBlog(searchBlogInput: any) {
    if(searchBlogInput.length > 0){

    }
  }

  deleteBlog(blogId: string) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        title: 'Delete Blog',
        message: 'Are you sure you want to delete this blog?'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.blogService.deleteBlogById(blogId).subscribe((result) => {
          // Perform delete operation here
          this.toastr.success('Blog deleted successfully!');
          this.ngOnInit();
        },(error) => {
          console.error(error);
          this.toastr.error('Something went wrong!');
        });
      }
      // If result is false or undefined, do nothing (user cancelled)
    });
  }

  private loadNextPage() {
    if (this.isLoading || !this.hasMore) return;
    this.isLoading = true;
    this.blogService.getAllBlogs(this.page, this.limit).subscribe((response: any) => {
      const incoming = response?.data || [];
      // Append new blogs
      this.blogs.data = [...(this.blogs.data || []), ...incoming];
      this.blogs.pagination = response?.pagination || null;

      // Update hasMore based on pagination
      const totalPages = response?.pagination?.pages;
      const currentPage = response?.pagination?.page;
      if (totalPages != null && currentPage != null) {
        this.hasMore = currentPage < totalPages;
      } else {
        // Fallback: if fewer than limit returned, assume no more
        this.hasMore = incoming.length === this.limit;
      }

      // Increment page for next fetch
      this.page += 1;
      this.isLoading = false;
      // Use setTimeout to allow DOM to update before checking content height
      setTimeout(() => {
        this.maybeLoadMoreOnShortContent();
      }, 100);
    }, (error:any) => {
      console.error(error);
      this.isLoading = false;
    });
  }

  editBlog(blog:any) {
    this.router.navigate([`user/${blog.author._id}/edit-blog/${blog._id}`]);
  }

  private getUserInfo() {
    if(sessionStorage.getItem('UserInfo')){
      this.userInfo = (sessionStorage.getItem('UserInfo'));
      this.userInfo = JSON.parse(this.userInfo);
    }
  }

  openBlog(blog: any) {
    if(!this.userInfo){
      this.toastr.error('Please login to view the blog');
    }
    else{
      this.router.navigate([`user/${this.userInfo.data._id}/blog/${blog._id}`]);
    }
  }

  // Scroll handling for infinite load
  @HostListener('window:scroll', [])
  onWindowScroll() {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
    const fullHeight = document.documentElement.scrollHeight || document.body.scrollHeight;
    if ((scrollTop + viewportHeight) >= (fullHeight - this.bottomThreshold)) {
      this.loadNextPage();
    }
  }

  private maybeLoadMoreOnShortContent() {
    const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
    const fullHeight = document.documentElement.scrollHeight || document.body.scrollHeight;
    if (fullHeight <= viewportHeight + this.bottomThreshold && this.hasMore && !this.isLoading) {
      this.loadNextPage();
    }
  }
}

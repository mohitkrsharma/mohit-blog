import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';
import {Component, OnInit, HostListener, OnDestroy} from '@angular/core';
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
export class LandingComponent implements OnInit, OnDestroy {
  searchBlogInput: string = '';
  private searchSubject = new Subject<string>();
  private destroy$ = new Subject<void>();
  protected readonly Date = Date;
  blogFormControl!: FormControl;
  blogs: any = { data: [], pagination: null };
  userInfo: any;
  page = 1;
  limit = 10;
  isLoading = false;
  hasMore = true;
  private bottomThreshold = 200; // px before bottom to trigger
  currentSearchTerm = ''; // Track current search term

  constructor(private dialog: MatDialog,private toastr: ToastrService, private blogService: BlogService,private router: Router) {
  }

  ngOnInit(): void {
    this.blogFormControl = new FormControl('');
    this.loadInitialBlogs();
    this.getUserInfo();

    // Setup debounced search
    this.searchSubject.pipe(
      debounceTime(500), // Wait 500ms after user stops typing
      distinctUntilChanged(), // Only emit if value is different from previous
      takeUntil(this.destroy$) // Cleanup on component destroy
    ).subscribe(searchTerm => {
      this.performSearch(searchTerm);
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onSearchInputChange(event: any): void {
    const searchTerm = event.target.value.trim();
    this.searchSubject.next(searchTerm);
  }

  private performSearch(searchTerm: string): void {
    this.currentSearchTerm = searchTerm;
    this.resetPagination();
    this.loadBlogs(true);
  }

  searchBlog(searchTerm: string): void {
    // This method can be called directly from the search icon click
    this.currentSearchTerm = searchTerm.trim();
    this.resetPagination();
    this.loadBlogs(true);
  }

  private resetPagination(): void {
    this.page = 1;
    this.hasMore = true;
    this.blogs.data = [];
    this.blogs.pagination = null;
  }

  private loadInitialBlogs(): void {
    this.loadBlogs(true);
  }

  private loadBlogs(reset: boolean = false): void {
    if (this.isLoading || (!reset && !this.hasMore)) return;

    this.isLoading = true;

    const searchQuery = this.currentSearchTerm || undefined;

    this.blogService.getAllBlogs(this.page, this.limit, searchQuery).subscribe(
      (response: any) => {
        const incoming = response?.data || [];

        if (reset) {
          // For initial load or search, replace the data
          this.blogs.data = incoming;
        } else {
          // For pagination, append to existing data
          this.blogs.data = [...(this.blogs.data || []), ...incoming];
        }

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

        // Increment page for next fetch only if not reset
        if (!reset) {
          this.page += 1;
        } else {
          this.page = (response?.pagination?.page || 1) + 1;
        }

        this.isLoading = false;

        // Use setTimeout to allow DOM to update before checking content height
        setTimeout(() => {
          this.maybeLoadMoreOnShortContent();
        }, 100);
      },
      (error: any) => {
        console.error('Error loading blogs:', error);
        this.isLoading = false;
        this.toastr.error('Failed to load blogs. Please try again.');
      }
    );
  }

  private loadNextPage() {
    this.loadBlogs(false);
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
    // Only trigger infinite scroll if not currently searching or if we have search results
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

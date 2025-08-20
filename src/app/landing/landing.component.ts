import {Component, OnInit} from '@angular/core';
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
  ],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.scss'
})
export class LandingComponent implements OnInit {
  protected readonly Date = Date;
  blogFormControl!: FormControl;
  searchBlogInput: any;
  blogs: any;
  userInfo:any;
  constructor(private dialog: MatDialog,private toastr: ToastrService, private blogService: BlogService,private router: Router) {
  }

  ngOnInit(): void {
    this.blogFormControl = new FormControl('');
    this.getBlogs();
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

  getBlogs() {
    this.blogService.getAllBlogs().subscribe((response: any) => {
      console.log(response);
      this.blogs = response;
    },(error:any)=>{
      console.error(error);
    })
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
}

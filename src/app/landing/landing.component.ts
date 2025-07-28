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
    MatDialogModule
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
  constructor(private dialog: MatDialog,private toastr: ToastrService, private blogService: BlogService) {
  }

  ngOnInit(): void {
    this.blogFormControl = new FormControl('');
    this.getBlogs();
    this.getUserInfo();
  }

  searchBlog(searchBlogInput: any) {

  }

  deleteBlog() {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        title: 'Delete Blog',
        message: 'Are you sure you want to delete this blog?'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        // Perform delete operation here
        this.toastr.warning('Blog deleted successfully!');
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

  editBlog() {

  }

  private getUserInfo() {
    if(sessionStorage.getItem('UserInfo')){
      this.userInfo = (sessionStorage.getItem('UserInfo'));
      this.userInfo = JSON.parse(this.userInfo);
    }
  }
}

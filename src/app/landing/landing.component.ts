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
import {MatDialog, MatDialogModule} from '@angular/material/dialog';
import {ConfirmationDialogComponent} from '../confirmation-dialog/confirmation-dialog.component';
import {ToastrService} from 'ngx-toastr';

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

  constructor(private dialog: MatDialog,private toastr: ToastrService) {
  }

  ngOnInit(): void {
    this.blogFormControl = new FormControl('');
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
}

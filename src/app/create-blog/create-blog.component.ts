import {Component, OnInit} from '@angular/core';
import {ToastrModule, ToastrService} from 'ngx-toastr';
import {FormsModule} from '@angular/forms';
import {MatButton} from '@angular/material/button';
import {Router} from '@angular/router';
import {NgIf} from '@angular/common';
import {MatIcon} from '@angular/material/icon';
import {MatError} from '@angular/material/input';
import {MatCard, MatCardContent, MatCardTitle} from '@angular/material/card';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-create-blog',
  imports: [
    FormsModule,
    MatButton,
    ToastrModule,
    NgIf,
    MatIcon,
    MatError,
    MatCardContent,
    MatCardTitle
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

  constructor(private toastr: ToastrService,private router: Router,private snackBar: MatSnackBar) {
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

  createBlog() {
    this.toastr.success('Success!', 'Blog created successfully!');
  }

  editBlog(){
    this.toastr.success('Success!', 'Blog edited successfully!');
  }

  /*onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (!file) return;

    const validTypes = ['image/jpeg', 'image/png'];

    if (!validTypes.includes(file.type)) {
      this.errorMessage = 'Only .jpg, .jpeg, and .png formats are allowed.';
      this.previewUrl = null;
      this.snackBar.open(this.errorMessage, 'Close', { duration: 3000 });
      return;
    }

    this.errorMessage = '';
    const reader = new FileReader();
    reader.onload = () => {
      this.previewUrl = reader.result;
    };
    reader.readAsDataURL(file);
  }*/
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (!file) return;

    const validTypes: string[] = ['image/jpeg', 'image/png'];

    if (!validTypes.includes(file.type)) {
      this.errorMessage = 'Only .jpg, .jpeg, and .png formats are allowed.';
      this.previewUrl = null;
      this.snackBar.open(this.errorMessage, 'Close', {duration: 3000});
      return;
    }

    this.errorMessage = '';
    const reader = new FileReader();
    reader.onload = () => {
      this.previewUrl = reader.result as string | ArrayBuffer | null;
    };
    reader.readAsDataURL(file);
  }
}

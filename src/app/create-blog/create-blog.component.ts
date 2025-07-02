import {Component, OnInit} from '@angular/core';
import {ToastrModule, ToastrService} from 'ngx-toastr';
import {FormsModule} from '@angular/forms';
import {MatButton} from '@angular/material/button';
import {Router} from '@angular/router';

@Component({
  selector: 'app-create-blog',
  imports: [
    FormsModule,
    MatButton,
    ToastrModule
  ],
  templateUrl: './create-blog.component.html',
  styleUrl: './create-blog.component.scss'
})
export class CreateBlogComponent implements OnInit{
  title: any;
  content: any;
  pageName!: string;

  constructor(private toastr: ToastrService,private router: Router) {
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
}

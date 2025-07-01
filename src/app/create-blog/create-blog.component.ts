import {Component, OnInit} from '@angular/core';
import {ToastrModule, ToastrService} from 'ngx-toastr';
import {FormsModule} from '@angular/forms';
import {MatButton} from '@angular/material/button';

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

  constructor(private toastr: ToastrService) {
  }

  ngOnInit(): void {
      throw new Error('Method not implemented.');
  }

  createBlog() {
    this.toastr.success('Success!', 'Blog created successfully!');
  }
}

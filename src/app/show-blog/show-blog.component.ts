import {Component, OnInit} from '@angular/core';
import {BlogService} from '../service/blog.service';
import {ActivatedRoute} from '@angular/router';
import {ToastrService} from 'ngx-toastr';
import {NgIf} from '@angular/common';
import {MatIcon} from '@angular/material/icon';
import {ParagraphPipe} from '../pipes/paragraph.pipe';

@Component({
  selector: 'app-show-blog',
  imports: [
    MatIcon,
    NgIf,
    ParagraphPipe
  ],
  templateUrl: './show-blog.component.html',
  styleUrl: './show-blog.component.scss'
})
export class ShowBlogComponent implements OnInit {
  blogId: string = '';
  userId: string = '';
  blogData:any;

  constructor(private blogService: BlogService,
              private route: ActivatedRoute,
              private toastr: ToastrService) {
    this.route.params.subscribe(params => {
      this.blogId = params['blogId'];
      this.userId = params['userId'];
    });
  }

  ngOnInit(): void {
    this.getBlogData();
  }

  getBlogData() {
    this.blogService.getBlogById(this.blogId).subscribe((response: any) => {
      console.log(response);
      this.blogData = response.data;
    },(error:any)=>{
      console.error(error);
      this.toastr.error('Error!', error?.error?.message || 'Something went wrong');
    });
  }
}

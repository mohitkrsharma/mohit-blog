import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class BlogService {
  private apiUrl = 'http://localhost:5000/api';

  constructor(private http: HttpClient) {
  }

  createBlog(params: object) {
    return this.http.post(this.apiUrl + '/blogs', params);
  }

  getAllBlogs() {
    return this.http.get(this.apiUrl + '/blogs');
  }

  getBlogById(blogId: string) {
    return this.http.get(this.apiUrl + `/blogs/${blogId}`);
  }

  deleteBlogById(blogId: any) {
    return this.http.delete(this.apiUrl + `/blogs/${blogId}`);
  }

  updateBlogById(blogId: any, params: object) {
    return this.http.put(this.apiUrl + `/blogs/${blogId}`, params);
  }
}

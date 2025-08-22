import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BlogService {
  private apiUrl = `${environment.apiServerUrl}/api`;

  constructor(private http: HttpClient) {
  }

  createBlog(params: object) {
    return this.http.post(this.apiUrl + '/blogs', params);
  }

  getAllBlogs(page?: number, limit?: number, searchQuery?: string) {
    let params = '';
    const queryParams = [];

    if (page) queryParams.push(`page=${page}`);
    if (limit) queryParams.push(`limit=${limit}`);
    if (searchQuery && searchQuery.trim()) queryParams.push(`q=${encodeURIComponent(searchQuery.trim())}`);

    if (queryParams.length > 0) {
      params = '?' + queryParams.join('&');
    }

    return this.http.get(this.apiUrl + '/blogs' + params);
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

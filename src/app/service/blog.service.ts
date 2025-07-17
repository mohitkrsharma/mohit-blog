import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class BlogService {
  private apiUrl = 'http://localhost:5000/api';
  constructor(private http: HttpClient) { }

  createBlog(params: object) {
    return this.http.post(this.apiUrl + '/blogs', params);
   }
}

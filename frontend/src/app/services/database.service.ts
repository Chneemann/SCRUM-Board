import { Injectable } from '@angular/core';
import { environment } from '../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DatabaseService {
  constructor(private http: HttpClient) {}

  dataUploaded: boolean = false;

  loadTasks(): Promise<any> {
    const url = environment.baseUrl + '/tasks/';
    return lastValueFrom(this.http.get(url));
  }

  loadUsers(): Promise<any> {
    const url = environment.baseUrl + '/users/';
    return lastValueFrom(this.http.get(url));
  }

  // Database query

  performRequest(
    method: 'DELETE' | 'POST' | 'PUT',
    url: string,
    body?: any
  ): Promise<any> {
    return new Promise((resolve) => {
      let request;

      switch (method) {
        case 'DELETE':
          request = this.http.delete<any>(url);
          break;
        case 'POST':
          request = this.http.post<any>(url, body);
          break;
        case 'PUT':
          request = this.http.put<any>(url, body);
          break;
      }

      request.subscribe((data) => {
        this.dataUploaded = true;
        resolve(method === 'DELETE' ? true : data);
      });
    });
  }

  deleteTask(postId: string): Promise<any> {
    const url = `${environment.baseUrl}/tasks/${postId}/`;
    return this.performRequest('DELETE', url);
  }

  createTask(body: any): Promise<any> {
    const url = `${environment.baseUrl}/tasks/`;
    return this.performRequest('POST', url, body);
  }

  updateTask(body: any, postId: string): Promise<any> {
    const url = `${environment.baseUrl}/tasks/${postId}/`;
    return this.performRequest('PUT', url, body);
  }
}

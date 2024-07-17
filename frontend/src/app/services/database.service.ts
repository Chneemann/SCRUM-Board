import { Injectable } from '@angular/core';
import { environment } from '../environments/environment.development';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DatabaseService {
  constructor(private http: HttpClient) {}

  dataUploaded: boolean = false;
  errorMsg: any = {};

  private getAuthHeaders(): HttpHeaders {
    const authToken = localStorage.getItem('authToken');
    return new HttpHeaders({
      Authorization: `token ${authToken}`,
    });
  }

  loadTasks(): Promise<any> {
    const url = environment.baseUrl + '/tasks/';
    const headers = this.getAuthHeaders();
    return lastValueFrom(this.http.get(url, { headers }));
  }

  loadSubtasks(): Promise<any> {
    const url = environment.baseUrl + '/subtasks/';
    const headers = this.getAuthHeaders();
    return lastValueFrom(this.http.get(url, { headers }));
  }

  loadUsers(): Promise<any> {
    const url = environment.baseUrl + '/users/';
    const headers = this.getAuthHeaders();
    return lastValueFrom(this.http.get(url, { headers }));
  }

  // Database query

  performRequest(
    method: 'DELETE' | 'POST' | 'PUT',
    url: string,
    body?: any
  ): Promise<any> {
    return new Promise((resolve, reject) => {
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

      request.subscribe(
        (data) => {
          this.dataUploaded = true;
          resolve(method === 'DELETE' ? true : data);
        },
        (error) => {
          this.errorMsg = error.error;
          console.error('Error occurred:', error);
        }
      );
    });
  }

  deleteDB(postId: string | number, directory: string): Promise<any> {
    const url = `${environment.baseUrl}/${directory}/${postId}/`;
    return this.performRequest('DELETE', url);
  }

  createDB(body: any, directory: string): Promise<any> {
    const url = `${environment.baseUrl}/${directory}/`;
    return this.performRequest('POST', url, body);
  }

  updateDB(body: any, postId: string, directory: string): Promise<any> {
    const url = `${environment.baseUrl}/${directory}/${postId}/`;
    return this.performRequest('PUT', url, body);
  }
}

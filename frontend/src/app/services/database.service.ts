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

  deleteTask(postId: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http
        .delete<any>(environment.baseUrl + '/tasks/' + postId + '/')
        .subscribe(
          (data) => {
            this.dataUploaded = true;
            resolve(true);
          },
          (error) => {
            reject(error);
          }
        );
    });
  }

  createTask(body: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http.post<any>(environment.baseUrl + '/tasks/', body).subscribe(
        (data) => {
          this.dataUploaded = true;
          resolve(data);
        },
        (error) => {
          reject(error);
        }
      );
    });
  }

  updateTask(body: any, postId: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http
        .put<any>(environment.baseUrl + '/tasks/' + postId + '/', body)
        .subscribe(
          (data) => {
            this.dataUploaded = true;
            resolve(data);
          },
          (error) => {
            reject(error);
          }
        );
    });
  }
}

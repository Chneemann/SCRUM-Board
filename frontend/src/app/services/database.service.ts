import { Injectable, OnInit } from '@angular/core';
import { environment } from '../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DatabaseService {
  constructor(private http: HttpClient) {}

  loadTasks(): Promise<any> {
    const url = environment.baseUrl + '/tasks/';
    return lastValueFrom(this.http.get(url));
  }

  loadUsers(): Promise<any> {
    const url = environment.baseUrl + '/users/';
    return lastValueFrom(this.http.get(url));
  }
}

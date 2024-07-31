import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../environments/environment.development';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  isUserLogin: boolean = false;
  currentUserId: number = 0;
  guestAccountUserId: number = 3;
  passwordFieldType: string = 'password';
  passwordIcon: string = './../../../assets/img/close-eye.svg';
  errorMsg: any = {};

  constructor(private http: HttpClient, private router: Router) {}

  togglePasswordVisibility() {
    this.passwordFieldType =
      this.passwordFieldType === 'password' ? 'text' : 'password';
    this.toggleIcon();
  }

  toggleIcon() {
    this.passwordIcon =
      this.passwordIcon === './../../../assets/img/close-eye.svg'
        ? './../../../assets/img/open-eye.svg'
        : './../../../assets/img/close-eye.svg';
  }

  checkAuthUser(): Promise<boolean> {
    const headers = this.getAuthHeaders();
    return new Promise<boolean>((resolve) => {
      this.http.get<any>(environment.baseUrl + '/auth/', { headers }).subscribe(
        (response) => {
          this.currentUserId = response;
          this.isUserLogin = true;
          resolve(true);
        },
        (error) => {
          this.isUserLogin = false;
          resolve(false);
        }
      );
    });
  }

  logout(): Promise<any> {
    const headers = this.getAuthHeaders();
    return new Promise((resolve) => {
      this.http
        .get<any>(environment.baseUrl + '/logout/', { headers })
        .subscribe((data) => {
          localStorage.removeItem('authToken');
          this.router.navigate(['/login/']);
          resolve(data);
        });
    });
  }

  login(body: any): Promise<any> {
    return new Promise((reject) => {
      this.http.post<any>(environment.baseUrl + '/login/', body).subscribe(
        (data) => {
          let authToken = data.toString();
          localStorage.setItem('authToken', authToken);
          this.router.navigate(['/board/']);
        },
        (error) => {
          this.errorMsg = error.error;
          reject(error);
        }
      );
    });
  }

  register(body: any): Promise<any> {
    return new Promise((reject) => {
      this.http.post<any>(environment.baseUrl + '/register/', body).subscribe(
        (data) => {
          this.login(body);
        },
        (error) => {
          this.errorMsg = error.error;
          reject(error);
        }
      );
    });
  }

  private getAuthHeaders(): HttpHeaders {
    const authToken = localStorage.getItem('authToken');
    return new HttpHeaders({
      Authorization: `token ${authToken}`,
    });
  }
}

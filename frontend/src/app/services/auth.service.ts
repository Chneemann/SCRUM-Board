import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  passwordFieldType: string = 'password';
  passwordIcon: string = './../../../assets/img/close-eye.svg';

  constructor(private http: HttpClient) {}

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

  login(body: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http.post<any>(environment.baseUrl + '/login/', body).subscribe(
        (data) => {
          resolve(data);
        },
        (error) => {
          reject(error);
        }
      );
    });
  }
}

import { Component } from '@angular/core';
import { FormBtnComponent } from '../../shared/component/form-btn/form-btn.component';
import { FormsModule, NgForm } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormBtnComponent, FormsModule, CommonModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  loginData = {
    username: '',
    password: '',
  };

  isPasswordIconVisible: boolean = true;

  constructor(public authService: AuthService) {}

  guestLogin() {
    const body = {
      username: 'guest',
      password: '1Fv^39;b&p',
    };
    this.authService.login(body);
  }

  onSubmit(ngForm: NgForm) {
    if (ngForm.submitted && ngForm.form.valid) {
      const body = {
        username: this.loginData.username,
        password: this.loginData.password,
      };
      this.authService.login(body);
    }
  }
}

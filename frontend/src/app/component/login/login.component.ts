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
    mail: '',
    password: '',
  };

  isPasswordIconVisible: boolean = true;

  constructor(public authService: AuthService) {}

  ifUserEmailIsValid(emailValue: string) {
    const emailRegex = /^[\w.%+-]+@[\w.-]+\.[a-zA-Z]{2,}$/;
    if (emailRegex.test(emailValue)) {
      return true;
    } else {
      return false;
    }
  }

  guestLogin() {
    const body = {
      email: 'guest@example.com',
      password: '1Fv^39;b&p',
    };
    this.authService.login(body);
  }

  onSubmit(ngForm: NgForm) {
    if (ngForm.submitted && ngForm.form.valid) {
      const body = {
        email: this.loginData.mail,
        password: this.loginData.password,
      };
      this.authService.login(body);
    }
  }
}

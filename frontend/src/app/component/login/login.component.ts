import { Component } from '@angular/core';
import { FormBtnComponent } from '../../shared/component/form-btn/form-btn.component';
import { FormsModule, NgForm } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormBtnComponent, FormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  loginData = {
    username: '',
    password: '',
  };

  isPasswordIconVisible: boolean = true;

  constructor(public authService: AuthService, private router: Router) {}

  guestLogin() {
    console.log('guest login');
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

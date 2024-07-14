import { Component } from '@angular/core';
import { FormBtnComponent } from '../../shared/component/form-btn/form-btn.component';
import { FormsModule, NgForm } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormBtnComponent, FormsModule, CommonModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent {
  loginData = {
    username: '',
    mail: '',
    password: '',
    passwordConfirm: '',
  };

  isPasswordIconVisible: boolean = true;

  constructor(public authService: AuthService, private router: Router) {}

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

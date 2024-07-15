import { Component } from '@angular/core';
import { FormBtnComponent } from '../../shared/component/form-btn/form-btn.component';
import { FormsModule, NgForm } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormBtnComponent, FormsModule, CommonModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent {
  isPasswordIconVisible: boolean = true;

  loginData = {
    firstName: '',
    lastName: '',
    mail: '',
    password: '',
    passwordConfirm: '',
  };

  constructor(public authService: AuthService) {}

  ifUserEmailIsValid(emailValue: string) {
    const emailRegex = /^[\w.%+-]+@[\w.-]+\.[a-zA-Z]{2,}$/;
    if (emailRegex.test(emailValue)) {
      return true;
    } else {
      return false;
    }
  }

  onSubmit(ngForm: NgForm) {
    if (ngForm.submitted && ngForm.form.valid) {
      const body = {
        first_name: this.loginData.firstName,
        last_name: this.loginData.lastName,
        username: this.loginData.firstName + this.loginData.lastName,
        email: this.loginData.mail,
        password: this.loginData.password,
      };
      this.authService.register(body);
    }
  }
}

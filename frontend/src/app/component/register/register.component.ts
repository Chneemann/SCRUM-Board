import { Component } from '@angular/core';
import { FormBtnComponent } from '../../shared/component/form-btn/form-btn.component';
import { FormsModule, NgForm } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { DatabaseService } from '../../services/database.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormBtnComponent, FormsModule, CommonModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent {
  allUsers: any[] = [];
  isPasswordIconVisible: boolean = true;

  loginData = {
    username: '',
    mail: '',
    password: '',
    passwordConfirm: '',
  };

  constructor(
    public dbService: DatabaseService,
    public authService: AuthService
  ) {}

  async ngOnInit() {
    this.loadDatabaseUsers();
  }

  async loadDatabaseUsers() {
    this.allUsers = await this.dbService.loadUsers();
    console.log(this.allUsers);
  }

  existUsername(username: string) {
    return this.allUsers.find((user) => user.username === username);
  }

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
        username: this.loginData.username,
        email: this.loginData.mail,
        password: this.loginData.password,
      };
      this.authService.register(body);
    }
  }
}

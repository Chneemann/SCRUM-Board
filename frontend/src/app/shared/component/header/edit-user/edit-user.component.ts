import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AuthService } from '../../../../services/auth.service';
import { FormBtnComponent } from '../../form-btn/form-btn.component';
import { FormsModule, NgForm } from '@angular/forms';
import { SharedService } from '../../../../services/shared.service';
import { DatabaseService } from '../../../../services/database.service';

@Component({
  selector: 'app-edit-user',
  standalone: true,
  imports: [FormBtnComponent, FormsModule],
  templateUrl: './edit-user.component.html',
  styleUrl: './edit-user.component.scss',
})
export class EditUserComponent implements OnInit {
  @Input() allUsers: any[] = [];
  @Output() closeUserOverview = new EventEmitter<string>();
  @Output() userUpdated = new EventEmitter<any>();

  constructor(
    public authService: AuthService,
    public sharedService: SharedService,
    private dbService: DatabaseService
  ) {}

  userData = {
    username: '',
    mail: '',
    firstName: '',
    lastName: '',
    password: '',
    passwordConfirm: '',
  };

  ngOnInit() {
    this.initializeUserData();
  }

  userIndex() {
    return this.allUsers.findIndex(
      (user) => user.id === +this.authService.currentUserId
    );
  }

  initializeUserData() {
    this.userData.username = this.allUsers[this.userIndex()].username;
    this.userData.mail = this.allUsers[this.userIndex()].email;
    this.userData.firstName = this.allUsers[this.userIndex()].first_name;
    this.userData.lastName = this.allUsers[this.userIndex()].last_name;
  }

  // Auxiliary functions

  stopPropagation(event: MouseEvent) {
    event.stopPropagation();
  }

  userOverviewClose(value: string) {
    this.closeUserOverview.emit(value);
  }

  onSubmit(ngForm: NgForm) {
    if (ngForm.submitted && ngForm.form.valid) {
      this.updateData();
    }
  }

  isInputNew() {
    if (
      this.userData.username !== this.allUsers[this.userIndex()].username ||
      this.userData.mail !== this.allUsers[this.userIndex()].email ||
      this.userData.firstName !== this.allUsers[this.userIndex()].first_name ||
      this.userData.lastName !== this.allUsers[this.userIndex()].last_name ||
      this.userData.password !== '' ||
      this.userData.passwordConfirm !== ''
    ) {
      return true;
    } else {
      return false;
    }
  }

  updateData() {
    const body = {
      username: this.userData.username,
      first_name: this.userData.firstName,
      last_name: this.userData.lastName,
    } as {
      username: string;
      first_name: string;
      last_name: string;
      email?: string;
      password?: string;
    };
    if (this.userData.mail !== this.allUsers[this.userIndex()].email) {
      body.email = this.userData.mail;
    }
    if (this.userData.password === this.userData.passwordConfirm) {
      body.password = this.userData.password;
    }
    this.dbService
      .updateDB(body, this.authService.currentUserId, 'users')
      .then((updatedUser) => {
        this.userUpdated.emit(updatedUser);
        if (this.dbService.dataUploaded) {
          this.userOverviewClose('');
        }
      });
  }
}

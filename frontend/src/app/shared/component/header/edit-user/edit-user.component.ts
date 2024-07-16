import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AuthService } from '../../../../services/auth.service';
import { FormBtnComponent } from '../../form-btn/form-btn.component';
import { FormsModule, NgForm } from '@angular/forms';
import { SharedService } from '../../../../services/shared.service';

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

  constructor(
    public authService: AuthService,
    public sharedService: SharedService
  ) {}

  userData = {
    username: '',
    mail: '',
    firstName: '',
    lastName: '',
  };

  ngOnInit() {
    this.initializeUserData();
  }

  initializeUserData() {
    let index = this.allUsers.findIndex(
      (user) => user.id === +this.authService.currentUserId
    );
    this.userData.username = this.allUsers[index].username;
    this.userData.mail = this.allUsers[index].email;
    this.userData.firstName = this.allUsers[index].first_name;
    this.userData.lastName = this.allUsers[index].last_name;
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
      console.log('send');
    }
  }
}

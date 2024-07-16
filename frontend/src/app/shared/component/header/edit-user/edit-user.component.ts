import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AuthService } from '../../../../services/auth.service';

@Component({
  selector: 'app-edit-user',
  standalone: true,
  imports: [],
  templateUrl: './edit-user.component.html',
  styleUrl: './edit-user.component.scss',
})
export class EditUserComponent {
  @Input() allUsers: any[] = [];
  @Output() closeUserOverview = new EventEmitter<string>();

  constructor(public authService: AuthService) {}
  // Auxiliary functions

  stopPropagation(event: MouseEvent) {
    event.stopPropagation();
  }

  userOverviewClose(value: string) {
    this.closeUserOverview.emit(value);
  }
}

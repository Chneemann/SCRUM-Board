import { Component, Input } from '@angular/core';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  @Input() allUsers: any[] = [];

  constructor(public authService: AuthService) {}

  currentUsername() {
    let index = this.allUsers.findIndex(
      (user) => user.id === this.authService.currentUserId
    );
    if (index !== -1) {
      return this.allUsers[index].username;
    }
  }

  logout() {
    this.authService.logout();
  }
}

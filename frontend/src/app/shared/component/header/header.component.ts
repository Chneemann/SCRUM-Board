import {
  Component,
  EventEmitter,
  HostListener,
  Input,
  Output,
} from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { DatabaseService } from '../../../services/database.service';
import { EditBoardComponent } from './edit-board/edit-board.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [EditBoardComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  @Input() allUsers: any[] = [];
  @Input() allBoards: any[] = [];
  @Output() openUserOverview = new EventEmitter<string>();

  boardName: string = '';
  openEditBoard: boolean = false;

  constructor(
    public authService: AuthService,
    public dbService: DatabaseService
  ) {}

  displayBoardData(query: string) {
    const index = this.allBoards.findIndex(
      (board) => board.id == this.dbService.getCurrentBoard()
    );
    if (index !== -1) {
      return this.allBoards[index][query];
    }
  }

  userOverviewOpen(value: string) {
    this.openUserOverview.emit(value);
  }

  toggleEditBoard(value: boolean) {
    this.openEditBoard = value;
  }

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

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
  openEditBoard: boolean = true;

  constructor(
    public authService: AuthService,
    public dbService: DatabaseService
  ) {}

  displayBoardData(query: string) {
    const index = this.allBoards.findIndex(
      (board) => board.id === this.dbService.currentBoard
    );
    if (index !== -1) {
      return this.allBoards[index][query];
    }
  }

  userOverviewOpen(value: string) {
    this.openUserOverview.emit(value);
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

  @HostListener('document:click', ['$event'])
  checkOpenEditBoard(event: MouseEvent) {
    const targetElement = event.target as HTMLElement;
    const isInsideEditBoard = targetElement.closest('#edit-board');
    const isEditBoardTitle = targetElement.closest('#edit-board-title');
    const isEditBoardBtnClose = targetElement.closest('#edit-board-close-img');

    if (isEditBoardTitle || isEditBoardBtnClose) {
      this.openEditBoard = !this.openEditBoard;
    } else if (!isInsideEditBoard) {
      this.openEditBoard = false;
    }
  }
}

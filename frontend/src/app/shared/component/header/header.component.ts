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
import { Task } from '../../../interfaces/task.interface';
import { InitialsPipe } from '../../../pipes/initials.pipe';
import { AddMemberComponent } from './add-member/add-member.component';
import { SharedService } from '../../../services/shared.service';
import { UserInitialsComponent } from '../user-initials/user-initials.component';
import { NavbarComponent } from './navbar/navbar.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    EditBoardComponent,
    AddMemberComponent,
    UserInitialsComponent,
    NavbarComponent,
    InitialsPipe,
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  @Input() allUsers: any[] = [];
  @Input() allBoards: any[] = [];
  @Input() allTasks: Task[] = [];
  @Output() openUserOverview = new EventEmitter<number>();

  boardName: string = '';
  assignedUsers: any[] = [];
  openNavbar: boolean = false;
  openEditBoard: boolean = false;
  openAddBoard: boolean = false;
  openSwitchBoard: boolean = false;
  openAddMember: boolean = false;

  constructor(
    public authService: AuthService,
    public dbService: DatabaseService,
    public sharedService: SharedService
  ) {}

  displayBoardData(query: string) {
    const index = this.allBoards.findIndex(
      (board) => board.id == this.dbService.getCurrentBoard()
    );
    if (index !== -1) {
      return this.allBoards[index][query];
    }
  }

  openLink(link: string) {
    if (link === 'profile') {
      this.userOverviewOpen();
    }
    if (link === 'addBoard') {
      this.toggleAddBoard(true);
    }
    if (link === 'editBoard') {
      this.toggleEditBoard(true);
    }
    if (link === 'switchBoard') {
      this.toggleSwitchBoard(true);
    }
  }

  userOverviewOpen() {
    this.openUserOverview.emit(this.authService.currentUserId);
  }

  toggleNavbar(value: boolean) {
    this.openNavbar = value;
  }

  toggleAddBoard(value: boolean) {
    this.openAddBoard = value;
  }

  toggleEditBoard(value: boolean) {
    this.openEditBoard = value;
  }

  toggleSwitchBoard(value: boolean) {
    this.openSwitchBoard = value;
  }

  toggleAddMember(value: boolean) {
    this.openAddMember = value;
  }

  currentUsername() {
    let index = this.allUsers.findIndex(
      (user) => user.id === this.authService.currentUserId
    );
    if (index !== -1) {
      return this.allUsers[index].username;
    }
  }

  firstLetter(word: string) {
    return word.charAt(0).toUpperCase();
  }

  isUserBoardAuthor() {
    if (this.allBoards.length > 0) {
      let index = this.allBoards.findIndex(
        (board) => board.id === +this.dbService.getCurrentBoard()
      );
      return this.allBoards[index].author === this.authService.currentUserId;
    }
    return;
  }

  logout() {
    this.authService.logout();
  }
}

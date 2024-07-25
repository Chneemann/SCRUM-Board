import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DatabaseService } from '../../../services/database.service';
import { InitialsPipe } from '../../../pipes/initials.pipe';

@Component({
  selector: 'app-user-initials',
  standalone: true,
  imports: [InitialsPipe],
  templateUrl: './user-initials.component.html',
  styleUrl: './user-initials.component.scss',
})
export class UserInitialsComponent {
  @Input() allBoards: any[] = [];
  @Input() allUsers: any[] = [];
  @Input() allTasks: any[] = [];
  @Input() currentTaskId: string = '';
  @Input() showAddMember: boolean = false;
  @Input() circles: string = '';
  @Output() openAddMemberOverview = new EventEmitter<boolean>();

  constructor(private dbService: DatabaseService) {}

  getAllBoardMembers() {
    if (this.allBoards.length > 0) {
      let index = this.allBoards.findIndex(
        (board) => board.id === +this.dbService.getCurrentBoard()
      );
      let author = this.allBoards[index].author;
      let members = this.allBoards[index].assigned;
      if (!members.includes(author)) {
        members.push(author);
      }
      return members;
    }
  }

  displayMemberData(memberId: string, query: string) {
    let index = this.allUsers.findIndex((member) => member.id === memberId);
    if (index != -1) {
      return this.allUsers[index][query];
    }
  }

  getAssignedUsers(taskId: string) {
    let index = this.allTasks.findIndex((task) => task.id === taskId);
    return this.allUsers.filter((user) =>
      this.allTasks[index].assigned.includes(user.id)
    );
  }

  toggleAddMemberOverview(value: boolean) {
    this.openAddMemberOverview.emit(value);
  }
}

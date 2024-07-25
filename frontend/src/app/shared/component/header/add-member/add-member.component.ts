import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DatabaseService } from '../../../../services/database.service';
import { InitialsPipe } from '../../../../pipes/initials.pipe';
import { SharedService } from '../../../../services/shared.service';
import { FormsModule, NgForm } from '@angular/forms';
import { FormFieldComponent } from '../../form-field/form-field.component';
import { AuthService } from '../../../../services/auth.service';

@Component({
  selector: 'app-add-member',
  standalone: true,
  imports: [FormFieldComponent, InitialsPipe, FormsModule],
  templateUrl: './add-member.component.html',
  styleUrl: './add-member.component.scss',
})
export class AddMemberComponent {
  @Input() allBoards: any[] = [];
  @Input() allUsers: any[] = [];
  @Input() allTasks: any[] = [];
  @Input() displayBoardData!: (query: string) => any;
  @Output() closeAddMemberOverview = new EventEmitter<boolean>();

  addMember: any[] = [];

  constructor(
    private dbService: DatabaseService,
    public sharedService: SharedService,
    public authService: AuthService
  ) {}

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

  getBoardMembers() {
    if (this.allBoards.length > 0) {
      let index = this.allBoards.findIndex(
        (board) => board.id === +this.dbService.getCurrentBoard()
      );
      return this.allBoards[index].assigned;
    }
  }

  getBoardAuthor() {
    if (this.allBoards.length > 0) {
      let index = this.allBoards.findIndex(
        (board) => board.id === +this.dbService.getCurrentBoard()
      );
      return this.allBoards[index].author;
    }
  }

  displayMemberData(memberId: string) {
    let index = this.allUsers.findIndex((member) => member.id === memberId);
    return this.allUsers[index];
  }

  addMemberOverviewClose() {
    this.closeAddMemberOverview.emit(false);
  }

  stopPropagation(event: MouseEvent) {
    event.stopPropagation();
  }

  onSubmit(ngForm: NgForm) {
    this.addMember = this.getBoardMembers();
    this.addMember.push(+ngForm.value.addMember);
    this.updateBoardData();
  }

  updateBoardData() {
    const body = {
      assigned: this.addMember,
    };
    this.dbService.updateDB(body, this.dbService.getCurrentBoard(), 'boards');
  }

  updateTaskData(assigned: string, taskId: string) {
    const body = {
      assigned: assigned,
    };
    this.dbService.updateDB(body, taskId, 'tasks');
  }

  deleteMember(userId: number) {
    this.addMember = this.getBoardMembers();
    let indexMember = this.addMember.findIndex((member) => member == userId);
    let indexTask = this.allTasks.findIndex((task) =>
      task.assigned.includes(userId)
    );
    if (indexTask !== -1) {
      let assignedIndex = this.allTasks[indexTask].assigned.indexOf(userId);
      if (assignedIndex !== -1) {
        this.allTasks[indexTask].assigned.splice(assignedIndex, 1);
        this.updateTaskData(
          this.allTasks[indexTask].assigned,
          this.allTasks[indexTask].id
        );
      }
    }
    this.addMember.splice(indexMember, 1);
    this.updateBoardData();
  }
}

import {
  Component,
  EventEmitter,
  Input,
  Output,
  SimpleChanges,
} from '@angular/core';
import { DatabaseService } from '../../../../services/database.service';
import { FormFieldComponent } from '../../form-field/form-field.component';
import { FormBtnComponent } from '../../form-btn/form-btn.component';
import { FormsModule, NgForm } from '@angular/forms';
import { AuthService } from '../../../../services/auth.service';

@Component({
  selector: 'app-edit-board',
  standalone: true,
  imports: [FormFieldComponent, FormBtnComponent, FormsModule],
  templateUrl: './edit-board.component.html',
  styleUrl: './edit-board.component.scss',
})
export class EditBoardComponent {
  @Input() allBoards: any[] = [];
  @Output() closeEditBoard = new EventEmitter<boolean>();

  constructor(
    public dbService: DatabaseService,
    private authService: AuthService
  ) {}

  boardData = {
    id: '',
    title: '',
    initialTitle: '',
    currentBoard: '',
  };

  ngOnChanges(changes: SimpleChanges) {
    if (changes['allBoards'] && changes['allBoards'].currentValue) {
      if (this.allBoards.length > 0) {
        this.initializeBoardData();
      }
    }
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

  boardIndex() {
    return this.allBoards.findIndex(
      (board) => board.id == this.dbService.getCurrentBoard()
    );
  }

  initializeBoardData() {
    this.boardData.id = this.allBoards[this.boardIndex()].id;
    this.boardData.title = this.allBoards[this.boardIndex()].title;
    this.boardData.initialTitle = this.allBoards[this.boardIndex()].title;
    this.boardData.currentBoard = this.allBoards[this.boardIndex()].id;
  }

  displayBoardData(query: string) {
    return this.allBoards[this.boardIndex()][query];
  }

  isInputNew() {
    if (this.boardData.title === this.boardData.initialTitle) {
      return true;
    } else {
      return false;
    }
  }

  stopPropagation(event: MouseEvent) {
    event.stopPropagation();
  }

  boardOverviewClose() {
    this.closeEditBoard.emit(false);
  }

  onSubmit(ngForm: NgForm) {
    if (ngForm.submitted && ngForm.form.valid) {
      this.updateData();
    }
  }

  deleteBoard() {
    const confirmed = confirm('Do you really want to delete the board?');
    if (confirmed) {
      this.dbService
        .deleteDB(this.dbService.getCurrentBoard(), 'boards')
        .then((updatedBoard) => {
          this.replaceBoard(updatedBoard);
          if (this.dbService.dataUploaded) {
            this.closeEditBoard.emit(false);
            window.location.reload();
          }
        });
    }
  }

  onSubmitSwitch(ngForm: NgForm) {
    this.dbService.setCurrentBoard(ngForm.value.initialTitle);
    this.closeEditBoard.emit(false);
  }

  updateData() {
    const body = {
      title: this.boardData.title,
    };
    this.dbService
      .updateDB(body, this.dbService.getCurrentBoard(), 'boards')
      .then((updatedBoard) => {
        this.replaceBoard(updatedBoard);
        if (this.dbService.dataUploaded) {
          this.closeEditBoard.emit(false);
        }
      });
  }

  replaceBoard(boardId: any) {
    const index = this.allBoards.findIndex((board) => board.id === boardId.id);
    if (index !== -1) {
      this.allBoards[index] = boardId;
    }
  }
}

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
import { timeout } from 'rxjs';

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

  constructor(public dbService: DatabaseService) {}

  boardData = {
    title: '',
    initialTitle: '',
  };

  ngOnChanges(changes: SimpleChanges) {
    if (changes['allBoards'] && changes['allBoards'].currentValue) {
      if (this.allBoards.length > 0) {
        this.initializeBoardData();
      }
    }
  }

  boardIndex() {
    return this.allBoards.findIndex(
      (board) => board.id === this.dbService.currentBoard
    );
  }

  initializeBoardData() {
    this.boardData.title = this.allBoards[this.boardIndex()].title;
    this.boardData.initialTitle = this.allBoards[this.boardIndex()].title;
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

  onSubmit(ngForm: NgForm) {
    if (ngForm.submitted && ngForm.form.valid) {
      this.updateData();
    }
  }

  updateData() {
    const body = {
      title: this.boardData.title,
    };
    this.dbService
      .updateDB(body, this.dbService.currentBoard, 'boards')
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

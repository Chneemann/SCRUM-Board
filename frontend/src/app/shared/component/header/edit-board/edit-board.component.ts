import { Component, Input, SimpleChanges } from '@angular/core';
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

  openEditBoard: boolean = true;

  constructor(public dbService: DatabaseService) {}

  boardData = {
    title: '',
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
  }

  displayBoardData(query: string) {
    return this.allBoards[this.boardIndex()][query];
  }

  onSubmit(ngForm: NgForm) {
    if (ngForm.submitted && ngForm.form.valid) {
      console.log('submit');
    }
  }
}

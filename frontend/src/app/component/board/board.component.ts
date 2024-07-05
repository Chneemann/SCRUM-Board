import { Component } from '@angular/core';
import { ViewTaskComponent } from './view-task/view-task.component';
import { AddTaskComponent } from './add-task/add-task.component';

@Component({
  selector: 'app-board',
  standalone: true,
  imports: [ViewTaskComponent, AddTaskComponent],
  templateUrl: './board.component.html',
  styleUrl: './board.component.scss',
})
export class BoardComponent {
  openNewTaskOverview: string = 'todo';

  addTask(status: string) {
    this.openNewTaskOverview = status;
  }

  closeTaskOverview(value: any) {
    this.openNewTaskOverview = value;
  }
}

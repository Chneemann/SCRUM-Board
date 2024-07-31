import { Component, Input } from '@angular/core';
import { Task } from '../../../../interfaces/task.interface';
import { DatabaseService } from '../../../../services/database.service';

@Component({
  selector: 'app-task-menu',
  standalone: true,
  imports: [],
  templateUrl: './task-menu.component.html',
  styleUrl: './task-menu.component.scss',
})
export class TaskMenuComponent {
  @Input() currentTaskId: string = '';
  @Input() boardTaskStatus: string = '';
  @Input() allTasks: Task[] = [];

  constructor(private dbService: DatabaseService) {}

  moveTask(moveTo: string) {
    const index = this.allTasks.findIndex(
      (task: any) => task.id === this.currentTaskId
    );
    if (index !== -1) {
      const body = {
        status: moveTo,
      };
      this.dbService.updateDB(body, this.currentTaskId, 'tasks').then(() => {
        this.allTasks[index].status = moveTo;
      });
    }
  }
}

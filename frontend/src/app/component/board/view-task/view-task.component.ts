import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { TaskColorsService } from '../../../services/task-colors.service';
import { DragDropService } from '../../../services/drag-drop.service';
import { Subtask, Task } from '../../../interfaces/task.interface';
import { InitialsPipe } from '../../../pipes/initials.pipe';
import { UserInitialsComponent } from '../../../shared/component/user-initials/user-initials.component';

@Component({
  selector: 'app-view-task',
  standalone: true,
  imports: [
    CommonModule,
    HttpClientModule,
    UserInitialsComponent,
    InitialsPipe,
  ],
  templateUrl: './view-task.component.html',
  styleUrl: './view-task.component.scss',
})
export class ViewTaskComponent {
  @Input() content: string = '';
  @Input() allTasks: Task[] = [];
  @Input() allSubtasks: Subtask[] = [];
  @Input() allUsers: any[] = [];
  @Input() allBoards: any[] = [];
  @Output() openTaskOverview = new EventEmitter<string>();
  @Output() startDraggingStatus = new EventEmitter<string>();

  openDescriptions: { [taskId: string]: boolean } = {};
  openSubtasks: { [taskId: string]: boolean } = {};
  openDates: { [taskId: string]: boolean } = {};

  constructor(
    private taskColorService: TaskColorsService,
    public dragDropService: DragDropService
  ) {}

  openTask(taskId: string) {
    this.openTaskOverview.emit(taskId);
  }

  hasTaskASubtask(taskId: string) {
    return this.allSubtasks.some((subtask) => subtask.task_id == +taskId);
  }

  startDragging(status: string) {
    this.startDraggingStatus.emit(status);
    this.openDescriptions = {};
    this.openSubtasks = {};
    this.openDates = {};
  }

  toggleDescription(taskId: string, event: MouseEvent) {
    event.stopPropagation();
    this.openDescriptions[taskId] = !this.openDescriptions[taskId];
  }

  toggleSubtasks(taskId: string, event: MouseEvent) {
    event.stopPropagation();
    this.openSubtasks[taskId] = !this.openSubtasks[taskId];
  }

  toggleDate(taskId: string, event: MouseEvent) {
    event.stopPropagation();
    this.openDates[taskId] = !this.openDates[taskId];
  }

  isDescriptionOpen(taskId: string): boolean {
    return !!this.openDescriptions[taskId];
  }

  isSubtasksOpen(taskId: string): boolean {
    return !!this.openSubtasks[taskId];
  }

  isDateOpen(taskId: string): boolean {
    return !!this.openDates[taskId];
  }

  firstLetter(word: string) {
    return word.charAt(0).toUpperCase();
  }

  findColor(color: string) {
    return this.taskColorService.findColor(color);
  }

  formatDate(dateString: string, clock: boolean): string {
    const date = new Date(dateString);

    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();

    if (clock) {
      let hours = date.getHours();
      const minutes = String(date.getMinutes()).padStart(2, '0');
      const seconds = String(date.getSeconds()).padStart(2, '0');

      const ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12;
      hours = hours ? hours : 12;
      const strHours = String(hours).padStart(2, '0');

      return `${day}.${month}.${year} ${strHours}:${minutes}:${seconds} ${ampm}`;
    } else {
      return `${day}.${month}.${year}`;
    }
  }
}

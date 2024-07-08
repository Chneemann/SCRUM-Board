import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { TaskColorsService } from '../../../services/task-colors.service';
import { DragDropService } from '../../../services/drag-drop.service';

@Component({
  selector: 'app-view-task',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './view-task.component.html',
  styleUrl: './view-task.component.scss',
})
export class ViewTaskComponent {
  @Input() content: string = '';
  @Input() allTasks: any[] = [];
  @Input() allUsers: any[] = [];
  @Output() openTaskOverview = new EventEmitter<string>();
  @Output() startDraggingStatus = new EventEmitter<string>();

  openDescriptions: { [taskId: string]: boolean } = {};
  openChecklist: { [taskId: string]: boolean } = {};
  openDates: { [taskId: string]: boolean } = {};

  constructor(
    private taskColorService: TaskColorsService,
    public dragDropService: DragDropService
  ) {}

  openTask(taskId: string) {
    this.openTaskOverview.emit(taskId);
  }

  startDragging(status: string) {
    this.startDraggingStatus.emit(status);
    this.openDescriptions = {};
    this.openChecklist = {};
    this.openDates = {};
  }

  toggleDescription(taskId: string, event: MouseEvent) {
    event.stopPropagation();
    this.openDescriptions[taskId] = !this.openDescriptions[taskId];
  }

  toggleChecklist(taskId: string, event: MouseEvent) {
    event.stopPropagation();
    this.openChecklist[taskId] = !this.openChecklist[taskId];
  }

  toggleDate(taskId: string, event: MouseEvent) {
    event.stopPropagation();
    this.openDates[taskId] = !this.openDates[taskId];
  }

  isDescriptionOpen(taskId: string): boolean {
    return !!this.openDescriptions[taskId];
  }

  isChecklistOpen(taskId: string): boolean {
    return !!this.openChecklist[taskId];
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

  formatDate(dateString: string): string {
    const date = new Date(dateString);

    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();

    let hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;
    const strHours = String(hours).padStart(2, '0');

    return `${day}.${month}.${year} ${strHours}:${minutes}:${seconds} ${ampm}`;
  }
}

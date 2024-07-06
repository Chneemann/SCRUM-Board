import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { TaskColorsService } from '../../../services/task-colors.service';

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

  openDescription: boolean = false;
  openDescriptionTaskId: string = '';

  constructor(private taskColorService: TaskColorsService) {}

  openTask(taskId: string) {
    this.openTaskOverview.emit(taskId);
  }

  toggleDescription(taskIndex: string, event: MouseEvent) {
    event.stopPropagation();
    this.openDescription = !this.openDescription;
    this.openDescriptionTaskId = taskIndex;
  }

  firstLetter(word: string) {
    return word.charAt(0).toUpperCase();
  }

  findColor(color: string) {
    return this.taskColorService.findColor(color);
  }
}

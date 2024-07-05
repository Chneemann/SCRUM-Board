import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { TaskColorsService } from '../../../services/task-colors.service';

@Component({
  selector: 'app-add-task',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './add-task.component.html',
  styleUrl: './add-task.component.scss',
})
export class AddTaskComponent {
  @Output() closeTaskOverview = new EventEmitter<string>();

  constructor(private taskColorService: TaskColorsService) {}

  taskData = {
    title: '',
    description: '',
    color: 'yellow',
  };

  findColor(color: string) {
    return this.taskColorService.findColor(color);
  }

  taskOverviewClose(value: string) {
    this.closeTaskOverview.emit(value);
  }

  stopPropagation(event: MouseEvent) {
    event.stopPropagation();
  }

  onSubmit(ngForm: NgForm) {
    if (ngForm.submitted && ngForm.form.valid) {
      console.log('send');
      this.taskOverviewClose('');
    }
  }
}

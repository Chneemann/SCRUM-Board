import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { TaskColorsService } from '../../../services/task-colors.service';
import { Task } from '../../../interfaces/task.interface';
import { DatabaseService } from '../../../services/database.service';

@Component({
  selector: 'app-add-task',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './add-task.component.html',
  styleUrl: './add-task.component.scss',
})
export class AddTaskComponent implements OnInit {
  @Input() taskId: string = '';
  @Input() allTasks: Task[] = [];
  @Input() allUsers: any[] = [];
  @Output() closeTaskOverview = new EventEmitter<string>();

  constructor(
    private taskColorService: TaskColorsService,
    public dbService: DatabaseService
  ) {}

  taskData: Task = {
    title: '',
    description: '',
    status: '',
    author: '',
    created_at: '',
    color: 'yellow',
  };

  ngOnInit() {
    this.initializeTaskData();
  }

  initializeTaskData() {
    const taskIndex = +this.taskId - 1;
    if (this.allTasks && this.allTasks[taskIndex]) {
      this.taskData.title = this.allTasks[taskIndex].title;
      this.taskData.description = this.allTasks[taskIndex].description;
      this.taskData.status = this.allTasks[taskIndex].status;
      this.taskData.color = this.allTasks[taskIndex].color;
      this.taskData.author = this.allTasks[taskIndex].author;
    }
  }

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
      const body = {
        title: this.taskData.title,
      };
      this.dbService.updateTask(body, this.taskId).then(() => {
        this.taskOverviewClose('');
      });
    }
  }
}

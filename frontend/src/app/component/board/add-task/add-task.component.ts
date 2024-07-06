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
  @Input() currentTaskId: string = '';
  @Input() allTasks: Task[] = [];
  @Input() allUsers: any[] = [];
  @Output() closeTaskOverview = new EventEmitter<string>();
  @Output() taskUpdated = new EventEmitter<any>();
  @Output() taskCreated = new EventEmitter<any>();

  isThisANewTask: boolean = false;

  constructor(
    private taskColorService: TaskColorsService,
    public dbService: DatabaseService
  ) {}

  taskData: Task = {
    title: '',
    description: '',
    status: '',
    author: '1',
    created_at: '',
    color: 'yellow',
  };

  ngOnInit() {
    this.initializeTaskData();
  }

  initializeTaskData() {
    const currentTaskIndex = this.allTasks.findIndex(
      (task) => +task.id! === +this.currentTaskId
    );
    if (this.allTasks && this.allTasks[currentTaskIndex]) {
      this.loadCurrentTaskData(currentTaskIndex);
      this.isThisANewTask = false;
    } else {
      this.taskData.status = this.currentTaskId;
      this.isThisANewTask = true;
    }
  }

  loadCurrentTaskData(taskIndex: number) {
    this.taskData.title = this.allTasks[taskIndex].title;
    this.taskData.description = this.allTasks[taskIndex].description;
    this.taskData.status = this.allTasks[taskIndex].status;
    this.taskData.color = this.allTasks[taskIndex].color;
    this.taskData.author = this.allTasks[taskIndex].author;
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
      if (this.isThisANewTask) {
        this.createTask();
      } else {
        this.updateTask();
      }
    }
  }

  createTask() {
    const body = {
      title: this.taskData.title,
      description: this.taskData.description,
      color: this.taskData.color,
      status: this.taskData.status,
      author: this.taskData.author,
    };
    this.dbService.createTask(body).then((updatedTask) => {
      this.taskCreated.emit(updatedTask);
      if (this.dbService.dataUploaded) {
        this.taskOverviewClose('');
      }
    });
  }

  updateTask() {
    const body = {
      title: this.taskData.title,
      description: this.taskData.description,
      color: this.taskData.color,
    };
    this.dbService.updateTask(body, this.currentTaskId).then((updatedTask) => {
      this.taskUpdated.emit(updatedTask);
      if (this.dbService.dataUploaded) {
        this.taskOverviewClose('');
      }
    });
  }
}

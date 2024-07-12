import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { TaskColorsService } from '../../../services/task-colors.service';
import { Subtask, Task } from '../../../interfaces/task.interface';
import { DatabaseService } from '../../../services/database.service';
import { AuthService } from '../../../services/auth.service';

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
  @Input() allSubtasks: Subtask[] = [];
  @Input() allUsers: any[] = [];
  @Output() closeTaskOverview = new EventEmitter<string>();
  @Output() taskUpdated = new EventEmitter<any>();
  @Output() taskCreated = new EventEmitter<any>();
  @Output() taskDeleted = new EventEmitter<any>();

  startAssignedValue: string | null = 'null';
  subtaskInputValue: string = '';
  clonedTaskDataAssigned: string[] = [];
  clonedTaskDataSubtasks: Subtask[] = [];
  isThisANewTask: boolean = false;
  isCurrentTaskIdNumber: boolean = false;

  constructor(
    private taskColorService: TaskColorsService,
    public dbService: DatabaseService,
    public authService: AuthService
  ) {}

  subtaskData: Subtask = {
    title: '',
    task_id: '',
    author: '',
  };

  taskData: Task = {
    title: '',
    description: '',
    status: '',
    priority: 'medium',
    author: this.authService.currentUserId,
    created_at: '',
    due_date: this.todaysDate(),
    color: 'yellow',
    subtasks: [],
    assigned: [],
  };

  ngOnInit() {
    this.initializeTaskData();
    this.initializeSubtaskData();
    this.isCurrentTaskIdNumber = isNaN(+this.currentTaskId);
  }

  preventEnterKey(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      event.preventDefault();
    }
  }

  todaysDate() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
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

  initializeSubtaskData() {
    const currentTaskIndex = this.allSubtasks.findIndex(
      (task) => +task.id! === +this.currentTaskId
    );
    if (this.allTasks && this.allSubtasks[currentTaskIndex]) {
      this.loadCurrentSubtaskData(currentTaskIndex);
    }
  }

  loadCurrentTaskData(taskIndex: number) {
    this.taskData.title = this.allTasks[taskIndex].title;
    this.taskData.description = this.allTasks[taskIndex].description;
    this.taskData.status = this.allTasks[taskIndex].status;
    this.taskData.color = this.allTasks[taskIndex].color;
    this.taskData.author = this.allTasks[taskIndex].author;
    this.taskData.assigned = this.allTasks[taskIndex].assigned;
    this.taskData.priority = this.allTasks[taskIndex].priority;
    this.taskData.due_date = this.allTasks[taskIndex].due_date;
    this.taskData.subtasks = this.loadSubtasks();
    this.clonedTaskDataAssigned = [...this.taskData.assigned];
  }

  loadCurrentSubtaskData(taskIndex: number) {
    this.subtaskData.title = this.allSubtasks[taskIndex].title;
    this.subtaskData.task_id = this.allSubtasks[taskIndex].task_id;
    this.subtaskData.author = this.allSubtasks[taskIndex].author;
    this.clonedTaskDataSubtasks = this.allSubtasks;
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

  deleteTask() {
    const confirmed = confirm('Do you really want to delete the task?');
    if (confirmed) {
      this.dbService.deleteTask(this.currentTaskId).then((success) => {
        if (success) {
          this.taskDeleted.emit(this.currentTaskId);
          if (this.dbService.dataUploaded) {
            this.taskOverviewClose('');
          }
        }
      });
    }
  }

  createTask() {
    this.taskData.assigned.push(this.authService.currentUserId);
    const body = {
      title: this.taskData.title,
      description: this.taskData.description,
      color: this.taskData.color,
      status: this.taskData.status,
      author: this.taskData.author,
      subtask: this.taskData.subtasks,
      due_date: this.taskData.due_date,
      priority: this.taskData.priority,
      assigned: this.clonedTaskDataAssigned,
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
      due_date: this.taskData.due_date,
      priority: this.taskData.priority,
      assigned: this.clonedTaskDataAssigned,
    };
    this.dbService.updateTask(body, this.currentTaskId).then((updatedTask) => {
      this.taskUpdated.emit(updatedTask);
      if (this.dbService.dataUploaded) {
        this.taskOverviewClose('');
      }
    });
  }

  updateSubtask() {
    const body = {
      title: this.taskData.title,
      task_id: this.currentTaskId,
      author: this.taskData.author,
    };
    this.dbService
      .updateSubtask(body, this.currentTaskId)
      .then((updatedSubtask) => {
        this.taskUpdated.emit(updatedSubtask);
        if (this.dbService.dataUploaded) {
          this.taskOverviewClose('');
        }
      });
  }

  // Assigned

  addAssigned(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    const selectedValue = selectElement.value;

    if (
      selectedValue !== 'null' &&
      !this.clonedTaskDataAssigned.some((assigned) => assigned == selectedValue)
    ) {
      this.clonedTaskDataAssigned.push(selectedValue);
      this.resetSelectValue();
    }
  }

  checkAssigned(selectedValue: string) {
    return this.clonedTaskDataAssigned.some(
      (assigned) => assigned == selectedValue
    );
  }

  deleteAssigned(selectedValue: string) {
    if (this.checkAssigned(selectedValue)) {
      let index = this.clonedTaskDataAssigned.indexOf(selectedValue);
      this.clonedTaskDataAssigned.splice(index, 1);
      this.resetSelectValue();
    }
  }

  resetSelectValue(): void {
    this.startAssignedValue = '';
    setTimeout(() => {
      this.startAssignedValue = 'null';
    }, 0);
  }

  // Subtask

  loadSubtasks() {
    return (this.taskData.subtasks = this.allSubtasks
      .filter((subtask) => subtask.task_id === this.currentTaskId)
      .map((subtask) => subtask.id!.toString()));
  }

  addSubtask(titleValue: string) {
    if (titleValue !== '') {
      const newSubtask = {
        id: 0,
        title: titleValue,
        task_id: this.currentTaskId,
        author: this.subtaskData.author,
      };
      this.clonedTaskDataSubtasks.push(newSubtask);
    }
    this.subtaskInputValue = '';
    this.createSubtask(titleValue);
  }

  createSubtask(titleValue: string) {
    let subtaskId;
    const bodySubtask = {
      title: titleValue,
      task_id: this.currentTaskId,
      author: this.subtaskData.author,
    };
    this.dbService.createSubtask(bodySubtask).then((updatedSubtask) => {
      this.taskCreated.emit(updatedSubtask);
      const index = this.allSubtasks.findIndex((subtask) => subtask.id === 0);
      if (index !== -1) {
        this.allSubtasks[index].id = updatedSubtask.id;
      }
    });
  }

  checkSubtask(selectedValue: number) {
    return this.clonedTaskDataSubtasks.some(
      (subtask) => subtask.id == selectedValue
    );
  }

  displaySubtaskTitle(selectedValue: number) {
    if (this.checkSubtask(selectedValue)) {
      let index = this.clonedTaskDataSubtasks.findIndex(
        (obj) => obj.id === selectedValue
      );
      return this.clonedTaskDataSubtasks[index].title;
    }
    return;
  }

  deleteSubtask(selectedValue: number) {
    this.dbService.deleteSubtask(selectedValue).then((success) => {
      let index = this.allSubtasks.findIndex((obj) => obj.id === selectedValue);
      this.allSubtasks.splice(index, 1);
    });
  }
}

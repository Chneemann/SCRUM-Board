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
    author: '1',
  };

  taskData: Task = {
    title: '',
    description: '',
    status: '',
    author: '1',
    created_at: '',
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
      assigned: this.clonedTaskDataAssigned,
    };
    this.dbService.updateTask(body, this.currentTaskId).then((updatedTask) => {
      this.taskUpdated.emit(updatedTask);
      if (this.dbService.dataUploaded) {
        this.taskOverviewClose('');
      }
    });
  }

  // updateSubtask() {
  //   const body = {
  //     title: this.taskData.title,
  //     task_id: this.currentTaskId,
  //     author: this.taskData.author,
  //   };
  //   this.dbService.updateTask(body, this.currentTaskId).then((updatedTask) => {
  //     this.taskUpdated.emit(updatedTask);
  //     if (this.dbService.dataUploaded) {
  //       this.taskOverviewClose('');
  //     }
  //   });
  // }

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
      .map((subtask) => subtask.id!));
  }

  addSubtask(value: string) {
    if (value !== '') {
      const newSubtask = {
        id: '0',
        title: value,
        task_id: this.currentTaskId,
        author: this.subtaskData.author,
      };
      this.clonedTaskDataSubtasks.push(newSubtask);
    }
    this.subtaskInputValue = '';
    console.log(this.clonedTaskDataSubtasks);
  }

  checkSubtask(selectedValue: string) {
    return this.clonedTaskDataSubtasks.some(
      (subtask) => subtask.id == selectedValue
    );
  }

  displaySubtaskTitle(selectedValue: string) {
    if (this.checkSubtask(selectedValue)) {
      let index = this.clonedTaskDataSubtasks.findIndex(
        (obj) => obj.id === selectedValue
      );
      return this.clonedTaskDataSubtasks[index].title;
    }
    return;
  }

  deleteSubtask(selectedValue: string) {
    if (this.checkSubtask(selectedValue)) {
      let index = this.taskData.subtasks.indexOf(selectedValue);
      this.taskData.subtasks.splice(index, 1);
    }
  }
}

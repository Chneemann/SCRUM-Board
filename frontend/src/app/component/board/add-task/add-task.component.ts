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
  @Input() allBoards: any[] = [];
  @Output() closeTaskOverview = new EventEmitter<string>();
  @Output() taskUpdated = new EventEmitter<any>();
  @Output() taskCreated = new EventEmitter<any>();
  @Output() taskDeleted = new EventEmitter<any>();

  startAssignedValue: string | null = 'null';
  subtaskInputValue: string = '';
  clonedTaskDataAssigned: number[] = [];
  tempTaskDataSubtasks: Subtask[] = [];
  isThisANewTask: boolean = false;
  isCurrentTaskIdNumber: boolean = false;

  constructor(
    private taskColorService: TaskColorsService,
    public dbService: DatabaseService,
    public authService: AuthService
  ) {}

  subtaskData: Subtask = {
    title: '',
    task_id: 0,
    author: this.authService.currentUserId,
    status: false,
  };

  taskData: Task = {
    title: '',
    board_id: '',
    description: '',
    status: '',
    priority: 'medium',
    author: this.authService.currentUserId,
    created_at: '',
    due_date: this.todaysDate(),
    color: 'yellow',
    assigned: [],
  };

  ngOnInit() {
    this.initializeTaskData();
    this.initializeSubtaskData();
    this.isCurrentTaskIdNumber = isNaN(+this.currentTaskId);
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

  getAllBoardMembers() {
    if (this.allBoards.length > 0) {
      let index = this.allBoards.findIndex(
        (board) => board.id === +this.dbService.getCurrentBoard()
      );
      let author = this.allBoards[index].author;
      let members = this.allBoards[index].assigned;
      if (!members.includes(author)) {
        author.push(members);
      }
      return members;
    }
  }

  displayMemberData(memberId: string, query: string) {
    let index = this.allUsers.findIndex((member) => member.id === memberId);
    if (index != -1) {
      return this.allUsers[index][query];
    }
  }

  // Initialization

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
    this.taskData.board_id = this.allTasks[taskIndex].board_id;
    this.taskData.description = this.allTasks[taskIndex].description;
    this.taskData.status = this.allTasks[taskIndex].status;
    this.taskData.color = this.allTasks[taskIndex].color;
    this.taskData.author = this.allTasks[taskIndex].author;
    this.taskData.assigned = this.allTasks[taskIndex].assigned;
    this.taskData.priority = this.allTasks[taskIndex].priority;
    this.taskData.due_date = this.allTasks[taskIndex].due_date;
    this.clonedTaskDataAssigned = [...this.taskData.assigned];
  }

  loadCurrentSubtaskData(taskIndex: number) {
    this.subtaskData.title = this.allSubtasks[taskIndex].title;
    this.subtaskData.task_id = this.allSubtasks[taskIndex].task_id;
    this.subtaskData.author = this.allSubtasks[taskIndex].author;
    this.subtaskData.status = this.allSubtasks[taskIndex].status;
  }

  // Auxiliary functions

  stopPropagation(event: MouseEvent) {
    event.stopPropagation();
  }

  taskOverviewClose(value: string) {
    this.tempTaskDataSubtasks = [];
    this.closeTaskOverview.emit(value);
  }

  findColor(color: string) {
    return this.taskColorService.findColor(color);
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

  // Post, Put & Delete on Server

  createTask() {
    this.taskData.assigned.push(this.authService.currentUserId);
    const body = {
      title: this.taskData.title,
      board_id: this.dbService.getCurrentBoard(),
      description: this.taskData.description,
      color: this.taskData.color,
      status: this.taskData.status,
      author: this.taskData.author,
      due_date: this.taskData.due_date,
      priority: this.taskData.priority,
      assigned: this.clonedTaskDataAssigned,
    };
    this.dbService.createDB(body, 'tasks').then((updatedTask) => {
      this.taskCreated.emit(updatedTask);
      if (this.dbService.dataUploaded) {
        this.createSubtask(updatedTask.id);
        this.taskOverviewClose('');
      }
    });
  }

  createSubtask(taskId: string) {
    for (let i = 0; i < this.tempTaskDataSubtasks.length; i++) {
      const bodySubtask = {
        id: this.tempTaskDataSubtasks[i].id,
        title: this.tempTaskDataSubtasks[i].title,
        task_id: +taskId,
        author: this.tempTaskDataSubtasks[i].author,
        status: this.tempTaskDataSubtasks[i].status,
      };
      this.dbService
        .createDB(bodySubtask, 'subtasks')
        .then((updatedSubtask) => {
          this.tempTaskDataSubtasks.splice(i, 1);
          bodySubtask.id = updatedSubtask.id;
          this.allSubtasks.push(bodySubtask);
        });
    }
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
    this.dbService
      .updateDB(body, this.currentTaskId, 'tasks')
      .then((updatedTask) => {
        this.taskUpdated.emit(updatedTask);
        if (this.dbService.dataUploaded) {
          this.createSubtask(updatedTask.id);
          this.taskOverviewClose('');
        }
      });
  }

  deleteTask() {
    const confirmed = confirm('Do you really want to delete the task?');
    if (confirmed) {
      this.dbService.deleteDB(this.currentTaskId, 'tasks').then((success) => {
        if (success) {
          this.taskDeleted.emit(this.currentTaskId);
          if (this.dbService.dataUploaded) {
            this.taskOverviewClose('');
          }
        }
      });
    }
  }

  addSubtask(titleValue: string) {
    const bodySubtask = {
      id: this.tempTaskDataSubtasks.length + 1,
      title: titleValue,
      task_id: 0,
      author: this.authService.currentUserId,
      status: false,
    };
    this.tempTaskDataSubtasks.push(bodySubtask);
    console.log(this.tempTaskDataSubtasks);
    this.subtaskInputValue = '';
  }

  changeCheckboxSubtask(subtaskId: number, event: Event) {
    const checked = (event.target as HTMLInputElement).checked;
    const body = {
      status: checked,
    };
    this.dbService
      .updateDB(body, subtaskId.toString(), 'subtasks')
      .then((updatedSubtask) => {
        const index = this.allSubtasks.findIndex(
          (subtask) => subtask.id === subtaskId
        );
        if (index !== -1) {
          this.allSubtasks[index].status = checked;
        }
      });
  }

  deleteSubtask(selectedValue: number) {
    this.dbService.deleteDB(selectedValue, 'subtasks').then((success) => {
      let index = this.allSubtasks.findIndex((obj) => obj.id === selectedValue);
      this.allSubtasks.splice(index, 1);
    });
  }

  // Assigned Data

  addAssigned(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    const selectedValue = selectElement.value;

    if (
      selectedValue !== 'null' &&
      !this.clonedTaskDataAssigned.some(
        (assigned) => assigned == +selectedValue
      )
    ) {
      this.clonedTaskDataAssigned.push(+selectedValue);
      this.resetSelectValue();
    }
  }

  checkAssigned(selectedValue: string) {
    return this.clonedTaskDataAssigned.some(
      (assigned) => assigned === +selectedValue
    );
  }

  deleteAssigned(selectedValue: string) {
    if (this.checkAssigned(selectedValue)) {
      let index = this.clonedTaskDataAssigned.indexOf(+selectedValue);
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

  // Subtask Data

  tempChangeCheckboxSubtask(subtaskId: number, event: Event) {
    const checked = (event.target as HTMLInputElement).checked;

    const index = this.tempTaskDataSubtasks.findIndex(
      (subtask) => subtask.id === subtaskId
    );
    if (index !== -1) {
      this.tempTaskDataSubtasks[index].status = checked;
    }
  }

  tempDeleteSubtask(selectedValue: number) {
    let index = this.tempTaskDataSubtasks.findIndex(
      (obj) => obj.id === selectedValue
    );
    this.tempTaskDataSubtasks.splice(index, 1);
  }
}

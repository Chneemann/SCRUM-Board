import { Component, OnInit } from '@angular/core';
import { ViewTaskComponent } from './view-task/view-task.component';
import { AddTaskComponent } from './add-task/add-task.component';
import { DatabaseService } from '../../services/database.service';
import { DragDropService } from '../../services/drag-drop.service';
import { HeaderComponent } from '../../shared/component/header/header.component';
import { AuthService } from '../../services/auth.service';
import { EditUserComponent } from '../../shared/component/header/edit-user/edit-user.component';

@Component({
  selector: 'app-board',
  standalone: true,
  imports: [
    ViewTaskComponent,
    AddTaskComponent,
    HeaderComponent,
    EditUserComponent,
  ],
  templateUrl: './board.component.html',
  styleUrl: './board.component.scss',
})
export class BoardComponent implements OnInit {
  openCurrentTaskOverview: string = '';
  openCurrentUserOverview: string = '';
  startDraggingStatus: string = '';
  allTasks: any[] = [];
  allSubtasks: any[] = [];
  allUsers: any[] = [];

  constructor(
    public dbService: DatabaseService,
    public dragDropService: DragDropService,
    public authService: AuthService
  ) {}

  async ngOnInit() {
    try {
      const loginSuccessful = await this.authService.checkAuthUser();
      if (loginSuccessful) {
        this.loadDatabaseTasks();
        this.loadDatabaseSubtasks();
        this.loadDatabaseUsers();
        this.handleDragAndDrop();
      }
    } catch (error) {
      console.error('Error during login check:', error);
    }
  }

  //  Database

  async loadDatabaseTasks() {
    this.allTasks = await this.dbService.loadTasks();
  }

  async loadDatabaseSubtasks() {
    this.allSubtasks = await this.dbService.loadSubtasks();
  }

  async loadDatabaseUsers() {
    this.allUsers = await this.dbService.loadUsers();
  }

  //  Drag & Drop

  handleDragAndDrop() {
    this.dragDropService.itemDropped.subscribe(({ id, status }) => {
      if (this.startDraggingStatus !== status) {
        this.handleItemDropped(id, status);
      }
    });
  }

  handleItemDropped(id: string, status: string): void {
    const body = {
      status: status,
    };
    this.dbService.updateTask(body, id).then((updatedTask) => {
      this.replaceTask(updatedTask);
    });
  }

  //  Tasks

  addTask(status: string) {
    this.openCurrentTaskOverview = status;
  }

  replaceTask(taskId: any) {
    const index = this.allTasks.findIndex((task) => task.id === taskId.id);
    if (index !== -1) {
      this.allTasks[index] = taskId;
    }
  }

  handleTaskUpdate(taskId: any) {
    this.replaceTask(taskId);
  }

  handleTaskCreated(taskId: any) {
    this.allTasks.push(taskId);
  }

  handleTaskDeletion(taskId: string) {
    const currentTaskIndex = this.allTasks.findIndex(
      (task) => task.id === taskId
    );
    if (currentTaskIndex !== -1) {
      this.allTasks.splice(currentTaskIndex, 1);
    }
  }

  toggleTaskOverview(value: any) {
    this.openCurrentTaskOverview = value;
    if (this.dbService.dataUploaded) {
      this.loadDatabaseTasks();
      this.dbService.dataUploaded = false;
    }
  }

  toggleUserOverview(value: any) {
    this.openCurrentUserOverview = value;
  }
}

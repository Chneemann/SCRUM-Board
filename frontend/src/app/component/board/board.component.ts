import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
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
  allBoards: any[] = [];
  allTasks: any[] = [];
  allSubtasks: any[] = [];
  allUsers: any[] = [];
  currentBoard: number = 0;

  constructor(
    public dbService: DatabaseService,
    public dragDropService: DragDropService,
    public authService: AuthService
  ) {}

  async ngOnInit() {
    try {
      const loginSuccessful = await this.authService.checkAuthUser();
      if (loginSuccessful) {
        this.loadDatabaseBoards();
        this.loadDatabaseUsers();
        this.handleDragAndDrop();
      }
    } catch (error) {
      console.error('Error during login check:', error);
    }

    this.dbService.currentBoard$.subscribe((newBoard) => {
      if (this.currentBoard !== newBoard) {
        this.currentBoard = newBoard;
        this.onBoardChange(newBoard);
      }
    });
  }

  async onBoardChange(newBoard: number) {
    await this.loadDatabaseTasks();
    await this.loadDatabaseSubtasks();
  }

  //  Database

  async loadDatabaseBoards() {
    this.allBoards = await this.dbService.getBoards();
    console.log('Boards loaded:', this.allBoards);
    await this.loadDatabaseTasks();
    await this.loadDatabaseSubtasks();
  }

  async loadDatabaseTasks() {
    const currentBoard = this.dbService.getCurrentBoard();
    console.log(currentBoard);

    this.allTasks = await this.dbService.getTasksByBoardId(+currentBoard);
    console.log('Tasks loaded:', this.allTasks);
  }

  async loadDatabaseSubtasks() {
    const taskIds = this.allTasks.map((task) => task.id);
    this.allSubtasks = await Promise.all(
      taskIds.map((taskId) => this.dbService.getSubtasksByTaskId(taskId))
    ).then((results) => results.flat());
    console.log('Subtasks loaded:', this.allSubtasks);
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
    this.dbService.updateDB(body, id, 'tasks').then((updatedTask) => {
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

  replaceUser(userId: any) {
    const index = this.allUsers.findIndex((task) => task.id === userId.id);
    if (index !== -1) {
      this.allUsers[index] = userId;
    }
  }

  handleUserUpdate(userId: any) {
    this.replaceUser(userId);
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

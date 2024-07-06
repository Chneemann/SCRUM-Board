import { Component, OnInit } from '@angular/core';
import { ViewTaskComponent } from './view-task/view-task.component';
import { AddTaskComponent } from './add-task/add-task.component';
import { DatabaseService } from '../../services/database.service';
import { DragDropService } from '../../services/drag-drop.service';

@Component({
  selector: 'app-board',
  standalone: true,
  imports: [ViewTaskComponent, AddTaskComponent],
  templateUrl: './board.component.html',
  styleUrl: './board.component.scss',
})
export class BoardComponent implements OnInit {
  openCurrentTaskOverview: string = '';
  startDraggingStatus: string = '';
  allTasks: any[] = [];
  allUsers: any[] = [];

  constructor(
    public dbService: DatabaseService,
    public dragDropService: DragDropService
  ) {
    this.handleDragAndDrop();
  }

  async ngOnInit() {
    this.loadDatabaseTasks();
    this.loadDatabaseUsers();
  }

  //  Database

  async loadDatabaseTasks() {
    this.allTasks = await this.dbService.loadTasks();
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
      this.dbService.dataUploaded = false;
    }
  }
}

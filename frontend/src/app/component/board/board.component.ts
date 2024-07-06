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
  allTasks: any[] = [];
  allUsers: any[] = [];

  constructor(
    public dbService: DatabaseService,
    public dragDropService: DragDropService
  ) {
    this.dragAndDrop();
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

  dragAndDrop() {
    this.dragDropService.itemDropped.subscribe(({ id, status }) => {
      this.handleItemDropped(id, status);
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

  replaceTask(updatedTask: any) {
    const index = this.allTasks.findIndex((task) => task.id === updatedTask.id);
    if (index !== -1) {
      this.allTasks[index] = updatedTask;
    }
  }

  handleTaskUpdate(updatedTask: any) {
    this.replaceTask(updatedTask);
  }

  toggleTaskOverview(value: any) {
    this.openCurrentTaskOverview = value;
    if (this.dbService.dataUploaded) {
      this.dbService.dataUploaded = false;
    }
  }
}

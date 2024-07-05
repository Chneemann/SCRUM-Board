import { Component, OnInit } from '@angular/core';
import { ViewTaskComponent } from './view-task/view-task.component';
import { AddTaskComponent } from './add-task/add-task.component';
import { DatabaseService } from '../../services/database.service';

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

  constructor(public dbService: DatabaseService) {}

  async ngOnInit() {
    this.allTasks = await this.dbService.loadTasks();
    this.allUsers = await this.dbService.loadUsers();
  }

  addTask(status: string) {
    this.openCurrentTaskOverview = status;
  }

  toggleTaskOverview(value: any) {
    this.openCurrentTaskOverview = value;
  }
}

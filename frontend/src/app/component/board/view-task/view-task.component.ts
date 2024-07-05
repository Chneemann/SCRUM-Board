import { Component, OnInit } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { HttpClientModule } from '@angular/common/http';
import { environment } from '../../../environments/environment.development';
import { CommonModule } from '@angular/common';
import { TaskColorsService } from '../../../services/task-colors.service';

@Component({
  selector: 'app-task',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './view-task.component.html',
  styleUrl: './view-task.component.scss',
})
export class ViewTaskComponent implements OnInit {
  tasks: any = [];
  users: any = [];
  openDescription: boolean = false;
  openDescriptionTaskId: string = '';

  constructor(
    private http: HttpClient,
    private taskColorService: TaskColorsService
  ) {}

  async ngOnInit() {
    this.tasks = await this.loadTasks();
    this.users = await this.loadUsers();
  }

  loadTasks() {
    const url = environment.baseUrl + '/tasks/';
    return lastValueFrom(this.http.get(url));
  }

  loadUsers() {
    const url = environment.baseUrl + '/users/';
    return lastValueFrom(this.http.get(url));
  }

  toggleDescription(taskIndex: string) {
    this.openDescription = !this.openDescription;
    this.openDescriptionTaskId = taskIndex;
  }

  firstLetter(word: string) {
    return word.charAt(0).toUpperCase();
  }

  findColor(color: string) {
    return this.taskColorService.findColor(color);
  }
}

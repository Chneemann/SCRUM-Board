import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ViewTaskComponent } from './view-task/view-task.component';
import { AddTaskComponent } from './add-task/add-task.component';
import { DatabaseService } from '../../services/database.service';
import { DragDropService } from '../../services/drag-drop.service';
import { HeaderComponent } from '../../shared/component/header/header.component';
import { AuthService } from '../../services/auth.service';
import { EditUserComponent } from '../../shared/component/header/edit-user/edit-user.component';
import { SharedService } from '../../services/shared.service';

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
    private sharedService: SharedService,
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
        this.onBoardChange();
      }
    });
  }

  async onBoardChange() {
    await this.loadDatabaseTasks();
    await this.loadDatabaseSubtasks();
  }

  //  Database

  async loadDatabaseBoards() {
    this.allBoards = await this.dbService.getBoards();
    if (this.allBoards.length > 0) {
      this.dbService.setCurrentBoard(this.allBoards[0]?.id);
    } else {
      this.addNewBoard();
    }
  }

  async loadDatabaseTasks() {
    const currentBoard = this.dbService.getCurrentBoard();
    this.allTasks = await this.dbService.getTasksByBoardId(+currentBoard);
  }

  async loadDatabaseSubtasks() {
    const taskIds = this.allTasks.map((task) => task.id);
    this.allSubtasks = await Promise.all(
      taskIds.map((taskId) => this.dbService.getSubtasksByTaskId(taskId))
    ).then((results) => results.flat());
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

  // New board and Task

  addNewBoard() {
    const body = {
      title: 'My First Board',
      author: this.authService.currentUserId,
    };
    this.dbService.createDB(body, 'boards').then((updatedBoard) => {
      if (this.dbService.dataUploaded) {
        this.allBoards.push(updatedBoard);
        this.dbService.setCurrentBoard(updatedBoard.id);
        this.createNewTasks(updatedBoard.id);
      }
    });
  }

  createNewTasks(boardId: number) {
    const currentUserId = this.authService.currentUserId;
    const currentDate = this.sharedService.todaysDate();
    // Define task details in an array
    const tasks = [
      {
        title: 'This is a task. Drag it to the "In progress"',
        description: 'Feel free to update this task as needed.',
        priority: 'high',
        color: 'green',
        createSubtasks: true,
      },
      {
        title: 'To edit a task simply click on it',
        description:
          'Descriptions can be useful to explain a task in more detail.',
        priority: 'medium',
        color: 'red',
        createSubtasks: false,
      },
    ];
    // Define subtasks for the first task
    const subtasks = [
      'This is a subtask',
      'Finish a subtask by clicking the checkbox next to it',
      'This is another subtask',
    ];
    // Create tasks
    tasks.forEach((taskDetails, index) => {
      const task = {
        ...taskDetails,
        board_id: boardId,
        status: 'todo',
        author: currentUserId,
        created_at: currentDate,
        due_date: currentDate,
        assigned: [],
      };
      // Create the task in the database
      this.dbService.createDB(task, 'tasks').then((updatedTask) => {
        if (this.dbService.dataUploaded) {
          this.allTasks.push(updatedTask);
          // Create subtasks for the first task if needed
          if (taskDetails.createSubtasks) {
            this.createSubtasksInOrder(updatedTask.id, currentUserId, subtasks);
          }
        }
      });
    });
  }

  createSubtasksInOrder(taskId: number, author: number, subtasks: string[]) {
    const createSubtask = (index: number) => {
      if (index >= subtasks.length) return;
      const subtaskTitle = subtasks[index];
      const bodySubtask = {
        title: subtaskTitle,
        task_id: taskId,
        author: author,
        status: false,
      };
      this.dbService
        .createDB(bodySubtask, 'subtasks')
        .then((updatedSubtask) => {
          if (this.dbService.dataUploaded) {
            this.allSubtasks.push(updatedSubtask);
            createSubtask(index + 1);
          }
        });
    };
    createSubtask(0);
  }
}

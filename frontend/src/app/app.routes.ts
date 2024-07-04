import { Routes } from '@angular/router';
import { BoardComponent } from './component/board/board.component';

export const routes: Routes = [
  { path: 'board/', component: BoardComponent },
  { path: 'board', redirectTo: 'board/', pathMatch: 'full' },
];

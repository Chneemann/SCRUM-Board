import { Routes } from '@angular/router';
import { BoardComponent } from './component/board/board.component';
import { LoginComponent } from './component/login/login.component';
import { RegisterComponent } from './component/register/register.component';

export const routes: Routes = [
  { path: 'board/', component: BoardComponent },
  { path: 'board', redirectTo: 'board/', pathMatch: 'full' },
  { path: 'login/', component: LoginComponent },
  { path: 'login', redirectTo: 'login/', pathMatch: 'full' },
  { path: 'register/', component: RegisterComponent },
  { path: 'register', redirectTo: 'register/', pathMatch: 'full' },
];

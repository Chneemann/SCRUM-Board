import { Routes } from '@angular/router';
import { BoardComponent } from './component/board/board.component';
import { LoginComponent } from './component/login/login.component';
import { RegisterComponent } from './component/register/register.component';

export const routes: Routes = [
  { path: '', component: BoardComponent },
  { path: 'board', component: BoardComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
];

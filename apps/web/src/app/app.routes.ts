import { Routes } from '@angular/router';
import { TodoComponent } from './pages/todo/todo.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';

export const routes: Routes = [
  { path: 'todo', component: TodoComponent },
  { path: '', redirectTo: '/todo', pathMatch: 'full' },
  { path: '**', component: NotFoundComponent },
];

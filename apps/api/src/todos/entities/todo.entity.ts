import { ITodo, TodoStatus } from '@todo-app/shared';
export class Todo implements ITodo {
  id: string;
  title?: string;
  description?: string;
  status: TodoStatus;
}

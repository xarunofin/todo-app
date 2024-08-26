import { Todo } from '../todos/entities/todo.entity';
import { TodoDocument } from 'src/todos/todo.schema';

export const mapToTodo = (todo?: TodoDocument): Todo => {
  if (!todo) return {} as Todo;
  return {
    id: todo.id,
    title: todo.title,
    description: todo.description,
    status: todo.status,
  };
};

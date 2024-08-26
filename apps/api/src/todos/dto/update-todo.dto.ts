import { TodoStatus } from '@todo-app/shared';
import { Todo } from '../entities/todo.entity';
import { IsEnum, IsOptional, IsString } from 'class-validator';

export class UpdateTodoDto implements Partial<Todo> {
  @IsOptional()
  @IsString()
  title?: string;
  @IsOptional()
  @IsString()
  description?: string;
  @IsOptional()
  @IsEnum(TodoStatus)
  status?: TodoStatus;
}

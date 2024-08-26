import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { TodoStatus } from '@todo-app/shared';
import { HydratedDocument } from 'mongoose';
import { Todo as TodoEntity } from './entities/todo.entity';

export type TodoDocument = HydratedDocument<Todo>;

@Schema()
export class Todo implements Partial<TodoEntity> {
  @Prop()
  title?: string;

  @Prop()
  description?: string;

  @Prop({ required: true })
  status: TodoStatus;
}

export const TodoSchema = SchemaFactory.createForClass(Todo);

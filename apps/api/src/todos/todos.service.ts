import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Todo, TodoDocument } from './todo.schema';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { toObjectId } from 'src/utils/mongoose.utils';
import { mapToTodo } from 'src/utils/todo.utils';
import { Todo as TodoEntity } from './entities/todo.entity';
import { TodoNotFoundException } from './exceptions/todo-not-found.exception';
import { InvalidTodoIdException } from './exceptions/invalid-todo-id.exception';

@Injectable()
export class TodosService {
  constructor(@InjectModel(Todo.name) private todoModel: Model<TodoDocument>) {}

  async create(createTodoDto: CreateTodoDto): Promise<TodoEntity> {
    const createdTodo = new this.todoModel(createTodoDto);
    const todo = await createdTodo.save();
    return mapToTodo(todo);
  }

  async findAll(): Promise<TodoEntity[]> {
    const list = await this.todoModel.find().exec();
    return list.map(mapToTodo);
  }

  async findOne(id: string): Promise<TodoEntity> {
    try {
      const objectId = toObjectId(id);
      const todo = await this.todoModel.findById(objectId).exec();
      if (!todo) {
        throw new TodoNotFoundException(id);
      }
      return mapToTodo(todo);
    } catch (error) {
      if (error instanceof Error && error.message === 'Invalid ID') {
        throw new InvalidTodoIdException(id);
      }
      throw error;
    }
  }

  async update(id: string, updateTodoDto: UpdateTodoDto): Promise<TodoEntity> {
    try {
      const objectId = toObjectId(id);
      const updatedTodo = await this.todoModel
        .findByIdAndUpdate(objectId, updateTodoDto, { new: true })
        .exec();
      if (!updatedTodo) {
        throw new TodoNotFoundException(id);
      }
      return mapToTodo(updatedTodo);
    } catch (error) {
      if (error instanceof Error && error.message === 'Invalid ID') {
        throw new InvalidTodoIdException(id);
      }
      throw error;
    }
  }

  async remove(id: string): Promise<TodoEntity> {
    try {
      const objectId = toObjectId(id);
      const deletedTodo = await this.todoModel
        .findByIdAndDelete(objectId)
        .exec();
      if (!deletedTodo) {
        throw new TodoNotFoundException(id);
      }
      return mapToTodo(deletedTodo);
    } catch (error) {
      if (error instanceof Error && error.message === 'Invalid ID') {
        throw new InvalidTodoIdException(id);
      }
      throw error;
    }
  }
}

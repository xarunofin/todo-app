import { BadRequestException } from '@nestjs/common';

export class InvalidTodoIdException extends BadRequestException {
  constructor(id: string) {
    super(`Invalid todo ID: ${id}`);
  }
}

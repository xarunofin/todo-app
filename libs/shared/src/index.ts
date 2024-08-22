// Types

export type TodoStatus = 'pending' | 'in-progress' | 'completed';

// Interfaces

export interface Todo {
  id: number;
  title: string;
  description?: string;
  status: TodoStatus;
}
// Constants

export const MAX_TODO_TITLE_LENGTH = 80;
export const MAX_TODO_DESCRIPTION_LENGTH = 512;

// Utility Functions

export function isValidTodoTitle(title: string): boolean {
  return title.length > 0 && title.length <= MAX_TODO_TITLE_LENGTH;
}

export function isValidTodoDescription(description: string): boolean {
  return description.length <= MAX_TODO_DESCRIPTION_LENGTH;
}

export function isValidTodoStatus(status: string): status is TodoStatus {
  return ['pending', 'in-progress', 'completed'].includes(status);
}

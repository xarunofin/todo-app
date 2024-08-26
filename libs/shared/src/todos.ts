// Types
export enum TodoStatus {
  pending,
  inProgress,
  completed,
}

// Interfaces

export interface ITodo {
  id: string;
  title?: string;
  description?: string;
  status: TodoStatus;
}

export interface StandardResponse<T> {
  statusCode: number;
  message?: string;
  data?: T;
  timestamp: string;
}

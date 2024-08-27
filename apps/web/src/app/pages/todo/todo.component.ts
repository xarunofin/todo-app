import { Component, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ITodo, StandardResponse, TodoStatus } from '@todo-app/shared';
import {
  CdkDragDrop,
  DragDropModule,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { HttpService } from '../../services/http.service';

interface Todo extends Partial<ITodo> {
  id?: string;
  title: string;
  description: string;
  status: TodoStatus;
}

@Component({
  selector: 'app-todo',
  host: {
    class: 'flex-1 flex',
  },
  standalone: true,
  imports: [CommonModule, FormsModule, DragDropModule],
  templateUrl: './todo.component.html',
})
export class TodoComponent {
  @ViewChild('inputCard') inputCard!: ElementRef;
  @ViewChild('descriptionInput') descriptionInput!: ElementRef;

  todoStatusInfo = Object.entries(TodoStatus)
    .map(([key, status]) => ({
      title:
        key.charAt(0).toUpperCase() +
        key.slice(1).replace(/([a-z])([A-Z])/g, '$1 $2'),
      status: status as TodoStatus,
    }))
    .filter(({ title }) => isNaN(Number(title)));

  isExpanded = false;
  isCardFocused = false;
  isTitleFocused = false;
  isDescriptionFocused = false;
  newTodo: Todo = { title: '', description: '', status: TodoStatus.pending };
  todos: Todo[] = [];
  editingTodo: Todo | null = null;

  constructor(private http: HttpService) {
    this.http.get('/todos').subscribe((response) => {
      const { data } = response as StandardResponse<Todo[]>;
      this.todos = data || [];
    });
  }

  onCardFocus() {
    this.isCardFocused = true;
  }

  onCardBlur() {
    this.isCardFocused = false;
  }

  onTitleFocus() {
    this.isTitleFocused = true;
  }

  onTitleBlur() {
    this.isTitleFocused = false;
    setTimeout(() => {
      if (
        this.isExpanded &&
        !this.isDescriptionFocused &&
        !this.isCardFocused &&
        !this.inputCard.nativeElement.contains(document.activeElement)
      ) {
        this.collapse();
      }
    });
  }

  onDescriptionChange() {
    if (this.newTodo.description.trim().length > 0 && !this.isExpanded) {
      this.expand();
    }
  }

  onDescriptionFocus() {
    this.isDescriptionFocused = true;
  }

  onDescriptionBlur() {
    this.isDescriptionFocused = false;
    setTimeout(() => {
      if (
        this.isExpanded &&
        !this.isTitleFocused &&
        !this.isCardFocused &&
        !this.inputCard.nativeElement.contains(document.activeElement)
      ) {
        this.collapse();
      }
    });
  }

  onDescriptionClick() {
    if (!this.isExpanded && this.isDescriptionFocused) {
      this.expand();
    }
  }

  onKeyUp(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      if (this.isExpanded) {
        this.collapse();
      }
    }
  }

  expand() {
    this.isExpanded = true;
    setTimeout(() => {
      this.descriptionInput.nativeElement.focus();
    });
  }

  collapse() {
    if (this.editingTodo) {
      this.updateTodo();
    } else if (
      this.newTodo.title.length > 0 ||
      this.newTodo.description.length > 0
    ) {
      this.addTodo();
    } else {
      this.resetNewTodo();
      this.isExpanded = false;
    }
    setTimeout(() => {
      this.descriptionInput.nativeElement.focus();
    });
  }

  addTodo() {
    this.http.post('/todos', { ...this.newTodo }).subscribe((response) => {
      const { data } = response as StandardResponse<Todo>;
      if (data) this.todos.push(data);
      this.resetNewTodo();
      this.isExpanded = false;
    });
  }

  deleteTodo(todo: Todo) {
    this.http.delete(`/todos/${todo.id}`).subscribe(() => {
      this.todos = this.todos.filter((t) => t.id !== todo.id);
    });
  }

  editTodo(todo: Todo) {
    this.editingTodo = { ...todo };
    this.newTodo = { ...todo };
    this.isExpanded = true;
    setTimeout(() => {
      this.descriptionInput.nativeElement.focus();
    });
  }

  updateTodo() {
    if (this.editingTodo) {
      this.http
        .patch(`/todos/${this.editingTodo.id}`, { ...this.newTodo })
        .subscribe((response) => {
          const { data } = response as StandardResponse<Todo>;
          if (data) {
            const index = this.todos.findIndex((t) => t.id === data.id);
            if (index !== -1) {
              this.todos[index] = data;
            }
          }
          this.resetNewTodo();
          this.editingTodo = null;
          this.isExpanded = false;
        });
    }
  }

  resetNewTodo() {
    this.newTodo = { title: '', description: '', status: TodoStatus.pending };
    this.editingTodo = null;
  }

  getTodosByStatus(status: TodoStatus): Todo[] {
    return this.todos.filter((todo) => todo.status === status);
  }

  drop(event: CdkDragDrop<Todo[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
    } else {
      const movedTodo = event.previousContainer.data[event.previousIndex];
      const previousStatus = movedTodo.status;

      const movedContainer = this.getStatusFromContainerId(event.container.id);
      if (movedContainer !== null) {
        this.updateTodoStatus({
          ...movedTodo,
          status: movedContainer,
        }).subscribe({
          next: (response) => {
            const { data } = response as StandardResponse<Todo>;
            if (data) {
              transferArrayItem(
                event.previousContainer.data,
                event.container.data,
                event.previousIndex,
                event.currentIndex,
              );
              this.todos[this.todos.indexOf(movedTodo)] = data;
            } else {
              movedTodo.status = previousStatus;
            }
          },
          error: (_error) => {
            movedTodo.status = previousStatus;
          },
        });
      }
    }
  }

  private updateTodoStatus(todo: Todo) {
    return this.http.patch(`/todos/${todo.id}`, {
      ...todo,
    });
  }

  private getStatusFromContainerId(containerId: string): TodoStatus | null {
    const statusInfo = this.todoStatusInfo.find(
      (info) => `cdk-drop-list-${info.status}` === containerId,
    );
    return statusInfo ? statusInfo.status : null;
  }
}

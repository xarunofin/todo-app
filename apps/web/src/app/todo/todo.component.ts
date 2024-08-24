import { Component, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ITodo, TodoStatus } from '@todo-app/shared';
import {
  CdkDragDrop,
  DragDropModule,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';

interface Todo extends Partial<ITodo> {
  title: string;
  description: string;
  status: TodoStatus;
}

@Component({
  selector: 'app-todo',
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
    if (this.newTodo.title.length > 0 || this.newTodo.description.length > 0) {
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
    this.todos.push({ ...this.newTodo });
    this.resetNewTodo();
    this.isExpanded = false;
  }

  deleteTodo(todo: Todo) {
    this.todos = this.todos.filter((t) => t !== todo);
  }

  resetNewTodo() {
    this.newTodo = { title: '', description: '', status: TodoStatus.pending };
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
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
      const movedContainer = this.getStatusFromContainerId(event.container.id);
      if (movedContainer !== null) {
        const movedTodo = event.container.data[event.currentIndex];
        movedTodo.status = movedContainer;
        this.updateTodoStatus(movedTodo);
      }
    }
  }

  private getStatusFromContainerId(containerId: string): TodoStatus | null {
    const statusInfo = this.todoStatusInfo.find(
      (info) => `cdk-drop-list-${info.status}` === containerId,
    );
    return statusInfo ? statusInfo.status : null;
  }

  private updateTodoStatus(todo: Todo) {
    const index = this.todos.indexOf(todo);
    if (index !== -1) {
      this.todos.splice(index, 1, { ...todo });
    }
  }
}

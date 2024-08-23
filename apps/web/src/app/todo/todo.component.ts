import { Component, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Todo {
  title: string;
  description: string;
}

@Component({
  selector: 'app-todo',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './todo.component.html',
})
export class TodoComponent {
  @ViewChild('descriptionInput') descriptionInput!: ElementRef;

  isExpanded = false;
  newTodo: Todo = { title: '', description: '' };
  todos: Todo[] = [];

  onInputChange() {
    if (this.newTodo.description.trim().length > 0 && !this.isExpanded) {
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
    this.newTodo.title = '';
    this.newTodo.description = '';
    this.isExpanded = false;
    setTimeout(() => {
      this.descriptionInput.nativeElement.focus();
    });
  }

  addTodo() {
    if (this.newTodo.description.trim()) {
      this.todos.push({ ...this.newTodo });
      this.resetNewTodo();
      this.isExpanded = false;
    }
  }

  resetNewTodo() {
    this.newTodo = { title: '', description: '' };
  }
}

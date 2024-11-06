import { CommonModule, TitleCasePipe } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-user-data-table',
  standalone: true,
  imports: [CommonModule, TitleCasePipe],
  templateUrl: './user-data-table.component.html',
  styleUrl: './user-data-table.component.css',
})
export class UserDataTableComponent {
  @Input() users: any[] = [];
  @Output() deleteUser = new EventEmitter<{ email: string; name: string }>();
  triggerDelete(email: string, name: string) {
    this.deleteUser.emit({ email, name });
  }
}

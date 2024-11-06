import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-edit-able-field',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './edit-able-field.component.html',
  styleUrl: './edit-able-field.component.css',
})
export class EditAbleFieldComponent {
  @Input() label!: string;
  @Input() value!: string;
  @Input() editingField!: string | null;
  @Input() field!: string;
  @Input() inputType: string = 'text';

  @Output() edit = new EventEmitter<string>();
  @Output() update = new EventEmitter<string>();
  @Output() cancel = new EventEmitter<void>();

  onEdit() {
    this.edit.emit(this.field);
  }

  onUpdate() {
    this.update.emit(this.value);
  }

  onCancel() {
    this.cancel.emit();
  }
}

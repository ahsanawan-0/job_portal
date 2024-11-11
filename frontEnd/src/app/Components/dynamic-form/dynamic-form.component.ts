import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-dynamic-form',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dynamic-form.component.html',
  styleUrl: './dynamic-form.component.css',
})
export class DynamicFormComponent {
  @Input() forms: any[] = [];
  @Input() title: string = '';
  @Input() sectionTitle: string = '';
  @Output() deleteFormById = new EventEmitter<{
    uniqueLinkId: string;
    formTitle: string;
  }>();
  @Output() openModal = new EventEmitter<{
    uniqueLinkId: string;
    formTitle: string;
  }>();

  @Output() onClickViewResults = new EventEmitter<{ uniqueLinkId: string }>();
  @Output() onClickViewDetail = new EventEmitter<{ uniqueLinkId: string }>();
  @Output() onClickCreateForm = new EventEmitter<string>();
  @Output() onClickAdmin = new EventEmitter<void>();

  dropdownIndex: number | null = null;
  onClickThreeDots(index: number) {
    if (this.dropdownIndex === index) {
      this.dropdownIndex = null;
    } else {
      this.dropdownIndex = index;
    }
  }

  onClickDelete(uniqueLinkId: string, formTitle: string) {
    this.deleteFormById.emit({ uniqueLinkId, formTitle });
    this.dropdownIndex = null;
  }

  onClickResults(uniqueLinkId: string) {
    this.onClickViewResults.emit({ uniqueLinkId });
  }

  onEdit(uniqueLinkId: string) {
    this.onClickViewDetail.emit({ uniqueLinkId });
  }

  onClickLink(uniqueLinkId: string, formTitle: string) {
    this.openModal.emit({ uniqueLinkId, formTitle });
  }

  onCreateForm() {
    this.onClickCreateForm.emit();
  }
}

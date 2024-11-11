import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FormsModule } from '@angular/forms';

interface Question {
  label: string;
  type: string;
  options: string[];
}

interface FormData {
  _id: string;
  title: string;
  questions: Question[];
  uniqueLinkId: string;
}

@Component({
  selector: 'app-review-form-admin-view',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './review-form-admin-view.component.html',
  styleUrl: './review-form-admin-view.component.css',
})
export class ReviewFormAdminViewComponent implements OnInit {
  @Input() formData: FormData = {
    _id: '',
    title: '',
    questions: [],
    uniqueLinkId: '',
  };

  @Output() updateFormEvent = new EventEmitter<FormData>();
  @Output() onClickBackAdminView = new EventEmitter<void>();

  onClickBackArrow() {
    this.onClickBackAdminView.emit();
  }

  onUpdateClick() {
    this.updateFormEvent.emit(this.formData);
  }

  ngOnInit(): void {
    console.log(this.formData);
  }

  isEditing: boolean = false;

  toggleEdit() {
    this.isEditing = !this.isEditing;
  }

  addOption(question: any) {
    question.options.push('');
  }

  removeOption(options: string[], index: number) {
    options.splice(index, 1);
  }

  addQuestion() {
    this.formData.questions.push({
      label: '',
      type: 'text',
      options: [],
    });
  }

  removeQuestion(index: number): void {
    this.formData.questions.splice(index, 1);
  }
  trackByIndex(index: number, item: any): number {
    return index;
  }

  // ngOnChanges(changes: SimpleChanges): void {
  //   if (changes['formData'] && changes['formData'].currentValue) {
  //     console.log('formData has changed:', this.formData);
  //   }
  // }
}

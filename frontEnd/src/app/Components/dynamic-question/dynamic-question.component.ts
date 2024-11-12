import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormArray,
  Validators,
  ReactiveFormsModule,
  FormControl,
  ValidatorFn,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { NotificationService } from '../../services/notification/notification.service';

@Component({
  selector: 'app-dynamic-question',
  templateUrl: './dynamic-question.component.html',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  styleUrls: ['./dynamic-question.component.css'],
})
export class DynamicQuestionComponent {
  notification = inject(NotificationService);

  form: FormGroup;
  maxOptions: number = 5;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      questions: this.fb.array([]),
      newQuestionType: ['text', Validators.required],
      newRadioOptionsCount: [3, [Validators.required, Validators.min(2)]],
    });
  }

  get questions(): FormArray {
    return this.form.get('questions') as FormArray;
  }

  addQuestion(): void {
    const questionType = this.form.get('newQuestionType')?.value;
    const radioOptionsCount = this.form.get('newRadioOptionsCount')?.value;

    if (questionType === 'radio' && radioOptionsCount < 2) {
      this.notification.showError(
        'Radio questions must have at least 2 options.'
      );

      return;
    }

    const questionGroup = this.fb.group({
      label: ['', Validators.required],
      type: [questionType, Validators.required],
      options:
        questionType === 'radio'
          ? this.fb.array(
              this.createRadioOptions(radioOptionsCount),
              this.uniqueOptionsValidator()
            )
          : this.fb.array([]),
    });

    this.questions.push(questionGroup);
    this.resetNewQuestionInputs();
  }

  private resetNewQuestionInputs(): void {
    this.form.get('newQuestionType')?.setValue('text');
    this.form.get('newRadioOptionsCount')?.setValue(3);
  }

  createRadioOptions(count: number): FormControl[] {
    return Array.from({ length: count }, () =>
      this.fb.control('', Validators.required)
    );
  }

  uniqueOptionsValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!(control instanceof FormArray)) return null;

      const optionValues = control.controls.map((ctrl) =>
        ctrl.value.trim().toLowerCase()
      );
      const duplicates = optionValues.filter(
        (item, index) => optionValues.indexOf(item) !== index
      );
      return duplicates.length > 0 ? { duplicateOptions: true } : null;
    };
  }

  removeQuestion(index: number): void {
    this.questions.removeAt(index);
  }

  getOptions(questionIndex: number): FormArray {
    return this.questions.at(questionIndex).get('options') as FormArray;
  }

  addOption(questionIndex: number): void {
    const options = this.getOptions(questionIndex);
    if (options.length >= this.maxOptions) {
      this.notification.showError(
        `Maximum of ${this.maxOptions} options allowed.`
      );

      return;
    }
    options.push(this.fb.control('', Validators.required));
  }

  removeOption(questionIndex: number, optionIndex: number): void {
    const options = this.getOptions(questionIndex);
    if (options.length > 2) {
      options.removeAt(optionIndex);
    } else {
      this.notification.showError(
        'Radio questions must have at least 2 options.'
      );
    }
  }
}

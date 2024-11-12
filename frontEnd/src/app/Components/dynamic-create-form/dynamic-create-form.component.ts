import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Output,
  OnInit,
  Input,
  inject,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormArray,
  Validators,
  ReactiveFormsModule,
  FormControl,
  AbstractControl,
  ValidationErrors,
  ValidatorFn,
} from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { NotificationService } from '../../services/notification/notification.service';

@Component({
  selector: 'app-dynamic-create-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './dynamic-create-form.component.html',
  styleUrl: './dynamic-create-form.component.css',
})
export class DynamicCreateFormComponent {
  @Output() createReviewForm = new EventEmitter<{
    formData: any;
  }>();
  @Output() openModal = new EventEmitter<{}>();
  @Output() onClickBack = new EventEmitter<void>();

  @Input() isCreatingForm: boolean = true;

  // onClickBackArrow() {
  //   this.onClickBack.emit = this.isCreatingForm false;
  // }

  onClickBackArrow() {
    this.onClickBack.emit();
  }

  onClickSave(formData: any) {
    this.createReviewForm.emit({ formData });
  }

  onClickLink() {
    this.openModal.emit();
  }

  notification = inject(NotificationService);

  form: FormGroup;
  maxOptions: number = 5;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      title: ['', Validators.required],
      questions: this.fb.array([]),
      newQuestionType: ['text', Validators.required],
      newRadioOptionsCount: [3, [Validators.required, Validators.min(2)]],
    });
  }

  ngOnInit(): void {}

  // Getter for 'questions' FormArray
  get questions(): FormArray {
    return this.form.get('questions') as FormArray;
  }

  uniqueOptionsValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!(control instanceof FormArray)) {
        return null; // If not a FormArray, do not apply this validator
      }

      const optionValues = control.controls.map((ctrl) =>
        ctrl.value.trim().toLowerCase()
      );

      const duplicates = optionValues.filter(
        (item, index) => optionValues.indexOf(item) !== index
      );

      return duplicates.length > 0 ? { duplicateOptions: true } : null;
    };
  }

  /**
   * Method to add a new question to the FormArray.
   */
  addQuestion(): void {
    const questionType = this.form.get('newQuestionType')?.value;
    const radioOptionsCount = this.form.get('newRadioOptionsCount')?.value;

    // Validate minimum number of radio options
    if (questionType === 'radio' && radioOptionsCount < 2) {
      this.notification.showError(
        'Radio questions must have at least 2 options.'
      );

      return;
    }

    // Create a new question FormGroup
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

    // Add the new question to the FormArray
    this.questions.push(questionGroup);

    // Reset the question type and options count for the next question
    this.form.get('newQuestionType')?.setValue('text');
    this.form.get('newRadioOptionsCount')?.setValue(3);

    console.log('Added Question:', questionGroup.value);
    console.log('Current Questions:', this.form.value.questions);
  }

  createRadioOptions(count: number): FormControl[] {
    const options: FormControl[] = [];
    for (let i = 0; i < count; i++) {
      options.push(this.fb.control('', Validators.required));
    }
    return options;
  }

  removeQuestion(index: number): void {
    this.questions.removeAt(index);
    console.log(`Removed Question at index ${index}`);
  }

  getOptions(questionIndex: number): FormArray {
    return this.questions.at(questionIndex).get('options') as FormArray;
  }

  addOption(questionIndex: number): void {
    const options = this.getOptions(questionIndex);
    if (options.length >= this.maxOptions) {
      this.notification.showError(
        `Maximum of ${this.maxOptions} options allowed`
      );

      return;
    }
    options.push(this.fb.control('', Validators.required));
    console.log(`Added Option to Question ${questionIndex + 1}`);
  }

  removeOption(questionIndex: number, optionIndex: number): void {
    const options = this.getOptions(questionIndex);
    if (options.length > 2) {
      // Ensure at least 2 options remain
      options.removeAt(optionIndex);
      console.log(
        `Removed Option ${optionIndex + 1} from Question ${questionIndex + 1}`
      );
    } else {
      this.notification.showError(
        'Radio questions must have at least 2 options.'
      );
    }
  }

  saveForm(): void {
    if (this.form.invalid) {
      this.notification.showError(
        'Please fill all required fields and ensure all radio options are unique.'
      );

      return;
    }

    const formData = this.form.value;
    console.log('Form Data:', formData);
    this.onClickSave(formData);
    this.onClickLink();
    this.form.reset();
  }
}

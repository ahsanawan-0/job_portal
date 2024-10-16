import { Component, OnInit } from '@angular/core';
import { 
  FormBuilder, 
  FormGroup, 
  FormArray, 
  Validators, 
  ReactiveFormsModule,
  FormControl,
  AbstractControl,
  ValidationErrors,
  ValidatorFn
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Required for Reactive Forms

@Component({
  selector: 'app-exit-interview-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './exit-interview-form.component.html',
  styleUrls: ['./exit-interview-form.component.css']
})
export class ExitInterviewFormComponent implements OnInit {
  form: FormGroup;
  maxOptions: number = 10; // Maximum allowed options for radio questions

  constructor(private fb: FormBuilder) {
    // Initialize the main form with 'title', 'questions', 'newQuestionType', and 'newRadioOptionsCount'
    this.form = this.fb.group({
      title: ['', Validators.required],
      questions: this.fb.array([]),
      newQuestionType: ['text', Validators.required],
      newRadioOptionsCount: [2, [Validators.required, Validators.min(2)]]
    });
  }

  ngOnInit(): void {}

  // Getter for 'questions' FormArray
  get questions(): FormArray {
    return this.form.get('questions') as FormArray;
  }

  /**
   * Custom validator to ensure all radio options are unique within a FormArray.
   * @returns ValidatorFn
   */
  uniqueOptionsValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!(control instanceof FormArray)) {
        return null; // If not a FormArray, do not apply this validator
      }

      const optionValues = control.controls.map(ctrl => ctrl.value.trim().toLowerCase());

      const duplicates = optionValues.filter((item, index) => optionValues.indexOf(item) !== index);

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
      alert('Radio questions must have at least 2 options.');
      return;
    }

    // Create a new question FormGroup
    const questionGroup = this.fb.group({
      label: ['', Validators.required],
      type: [questionType, Validators.required],
      options: questionType === 'radio' 
        ? this.fb.array(this.createRadioOptions(radioOptionsCount), this.uniqueOptionsValidator())
        : this.fb.array([])
    });

    // Add the new question to the FormArray
    this.questions.push(questionGroup);

    // Reset the question type and options count for the next question
    this.form.get('newQuestionType')?.setValue('text');
    this.form.get('newRadioOptionsCount')?.setValue(2);

    console.log('Added Question:', questionGroup.value);
    console.log('Current Questions:', this.form.value.questions);
  }

  /**
   * Method to create an array of radio option FormControls.
   * @param count Number of options to create.
   * @returns Array of FormControl.
   */
  createRadioOptions(count: number): FormControl[] {
    const options: FormControl[] = [];
    for (let i = 0; i < count; i++) {
      options.push(this.fb.control('', Validators.required));
    }
    return options;
  }

  /**
   * Method to remove a question from the FormArray.
   * @param index Index of the question to remove.
   */
  removeQuestion(index: number): void {
    this.questions.removeAt(index);
    console.log(`Removed Question at index ${index}`);
  }

  /**
   * Getter to retrieve the 'options' FormArray for a specific question.
   * @param questionIndex Index of the question.
   * @returns FormArray of options.
   */
  getOptions(questionIndex: number): FormArray {
    return this.questions.at(questionIndex).get('options') as FormArray;
  }

  /**
   * Method to add an option to a radio-type question.
   * @param questionIndex Index of the question.
   */
  addOption(questionIndex: number): void {
    const options = this.getOptions(questionIndex);
    if (options.length >= this.maxOptions) {
      alert(`Maximum of ${this.maxOptions} options allowed.`);
      return;
    }
    options.push(this.fb.control('', Validators.required));
    console.log(`Added Option to Question ${questionIndex + 1}`);
  }

  /**
   * Method to remove an option from a radio-type question.
   * @param questionIndex Index of the question.
   * @param optionIndex Index of the option to remove.
   */
  removeOption(questionIndex: number, optionIndex: number): void {
    const options = this.getOptions(questionIndex);
    if (options.length > 2) { // Ensure at least 2 options remain
      options.removeAt(optionIndex);
      console.log(`Removed Option ${optionIndex + 1} from Question ${questionIndex + 1}`);
    } else {
      alert('Radio questions must have at least 2 options.');
    }
  }

  /**
   * Method to save the form data.
   */
  saveForm(): void {
    if (this.form.invalid) {
      alert('Please fill all required fields and ensure all radio options are unique.');
      return;
    }

    const formData = this.form.value;
    console.log('Form Data:', formData);
    // TODO: Replace the console.log with an API call to save the data
  }

  /**
   * Placeholder method for Share Link functionality.
   */
  openApplyModal(): void {
    // Implement the logic to open the modal
    alert('Share Link functionality to be implemented.');
  }
}

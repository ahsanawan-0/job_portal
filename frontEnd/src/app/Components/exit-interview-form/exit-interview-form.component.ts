import { Component, inject, OnInit } from '@angular/core';
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
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Required for Reactive Forms
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ExitInterviewModalComponent } from '../../modals/exit-interview-modal/exit-interview-modal.component';
import { ExitInterviewService } from '../../services/exit_interview/exit-interview.service';
import { NotificationService } from '../../services/notification/notification.service';

@Component({
  selector: 'app-exit-interview-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './exit-interview-form.component.html',
  styleUrls: ['./exit-interview-form.component.css'],
})
export class ExitInterviewFormComponent implements OnInit {
  notification = inject(NotificationService);
  form: FormGroup;
  maxOptions: number = 5; // Maximum allowed options for radio questions
  private modalService = inject(NgbModal);
  dynamicLink: string = ''; // Define the dynamicLink property

  constructor(
    private fb: FormBuilder,
    private exitInterviewService: ExitInterviewService
  ) {
    // Initialize the main form with 'title', 'questions', 'newQuestionType', and 'newRadioOptionsCount'
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
        `Maximum of ${this.maxOptions} options allowed.`
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

  title: string = '';

  saveForm(): void {
    if (this.form.invalid) {
      this.notification.showError(
        'Please fill all required fields and ensure all radio options are unique.'
      );

      return;
    }

    const formData = this.form.value;
    console.log('Form Data:', formData);

    this.exitInterviewService.createForm(formData).subscribe({
      next: (response: any) => {
        this.notification.showSuccess('Form created successfully!');

        console.log('Form created:', response);

        // Generate a dynamic link using the form ID
        const uniqueLinkId = response.form.uniqueLinkId; // Ensure the response contains the ID of the created form
        const dynamicLink = `http://localhost:4200/exitInterviewViewForm/${uniqueLinkId}`;
        this.title = response.form.title;

        // Open the modal with the dynamic link
        this.openApplyModal(dynamicLink);
        this.form.reset();
      },
      error: (error: any) => {
        console.error('Error creating form:', error);
        this.notification.showError('There was an error creating the form.');
      },
    });
  }

  openApplyModal(dynamicLink: string): void {
    this.dynamicLink = dynamicLink; // Assign the dynamicLink to the property
    const modalRef = this.modalService.open(ExitInterviewModalComponent);
    modalRef.componentInstance.link = this.dynamicLink; // Pass the dynamic link to the modal
    modalRef.componentInstance.name = 'Exit Interview';
    modalRef.componentInstance.title = this.title;
  }
}

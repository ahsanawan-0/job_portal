import { Component, OnInit } from '@angular/core';
import { ExitInterviewService } from '../../services/exit_interview/exit-interview.service';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
  ReactiveFormsModule,
  FormArray,
} from '@angular/forms';

import { ActivatedRoute } from '@angular/router';

interface ExitInterviewForm {
  title: string;
  questions: Question[];
}

interface Question {
  _id: string; // Add ID property to match the response
  label: string;
  type: 'text' | 'textarea' | 'radio';
  options?: FormArray;
}

@Component({
  selector: 'app-exit-interview-form-detail',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './exit-interview-form-detail.component.html',
  styleUrl: './exit-interview-form-detail.component.css',
})
export class ExitInterviewFormDetailComponent implements OnInit {
  form: FormGroup;
  exitInterviewForm?: ExitInterviewForm;
  isLoading: boolean = true;
  errorMessage: string = '';
  isEditing: boolean = false; // State for editing

  constructor(
    private fb: FormBuilder,
    private exitInterviewService: ExitInterviewService,
    private route: ActivatedRoute
  ) {
    this.form = this.fb.group({
      employeeName: new FormControl(
        { value: '', disabled: true },
        Validators.required
      ),
      employeeId: new FormControl({ value: '', disabled: true }, [
        Validators.required,
        Validators.pattern(/^\d{9}$/),
      ]),
      questions: this.fb.array([]), // Initialize as an empty array
    });
  }

  ngOnInit(): void {
    // Get the formId from the route parameters
    this.route.params.subscribe((params) => {
      const uniqueLinkId = params['uniqueLinkId'];
      this.fetchForm(uniqueLinkId);
    });
  }

  fetchForm(uniqueLinkId: string): void {
    this.exitInterviewService.getForm(uniqueLinkId).subscribe({
      next: (data: any) => {
        this.exitInterviewForm = data.response;
        this.buildForm();
        this.isLoading = false;
      },
      error: (error: any) => {
        console.error('Error fetching form:', error);
        this.errorMessage = 'Failed to load the form. Please try again later.';
        this.isLoading = false;
      },
    });
  }

  buildForm(): void {
    if (!this.exitInterviewForm) return;

    // Set initial values for employeeName and employeeId
    this.form.patchValue({
      employeeName: '',
      employeeId: '',
    });

    // Populate the form array with questions
    this.exitInterviewForm.questions.forEach((question) => {
      this.addQuestion(question);
    });
  }

  addQuestion(question?: Question): void {
    const questionGroup = this.fb.group({
      label: new FormControl(question?.label || '', Validators.required),
      type: new FormControl(question?.type || 'text', Validators.required),
      answer: new FormControl({ value: '', disabled: !this.isEditing }), // Disabled by default
      options: this.fb.array([]), // Initialize options as an empty FormArray
    });

    // If question has options, populate them into the options FormArray
    if (question?.options && Array.isArray(question.options)) {
      question.options.forEach((option: string) => {
        // Explicitly define option type
        (questionGroup.get('options') as FormArray).push(
          new FormControl(option)
        );
      });
    }

    this.questions.push(questionGroup);
  }

  getOptions(index: number): FormArray {
    return this.questions.at(index).get('options') as FormArray;
  }
  get questions() {
    return this.form.get('questions') as FormArray;
  }

  toggleEdit(): void {
    this.isEditing = !this.isEditing;

    if (this.isEditing) {
      this.questions.controls.forEach((question) => {
        question.get('answer')?.enable();
      });
    } else {
      this.questions.controls.forEach((question) => {
        question.get('answer')?.disable();
      });

      // You may want to save changes here
    }
  }

  onSubmit(): void {
    if (this.form.invalid) {
      return;
    }

    // Handle form submission
    // Implement your submission logic here
  }
}

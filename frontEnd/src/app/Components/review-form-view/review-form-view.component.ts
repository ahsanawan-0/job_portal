import { Component, inject, OnInit } from '@angular/core';
import { ReviewFormService } from '../../services/review_Form/review-form.service';
import { ActivatedRoute } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NotificationService } from '../../services/notification/notification.service';

interface ReviewForm {
  title: string;
  questions: Question[];
}

interface Question {
  _id?: string;
  label: string;
  type: string;
  options?: string[];
}

@Component({
  selector: 'app-review-form-view',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './review-form-view.component.html',
  styleUrl: './review-form-view.component.css',
})
export class ReviewFormViewComponent implements OnInit {
  service = inject(ReviewFormService);
  notification = inject(NotificationService);

  form: FormGroup;
  reviewForm?: ReviewForm;
  isLoading: boolean = true;
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,

    private route: ActivatedRoute
  ) {
    this.form = this.fb.group({});
  }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      console.log('All params:', params);
      const uniqueLinkId = params['uniqueLinkId'];
      this.fetchForm(uniqueLinkId);
      console.log('uuid', uniqueLinkId);
    });
  }

  fetchForm(uniqueLinkId: string): void {
    this.service.getFormbyId(uniqueLinkId).subscribe({
      next: (data: any) => {
        this.reviewForm = data.response;
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
    if (!this.reviewForm) return;

    // Initialize the form controls
    const formControls: { [key: string]: FormControl } = {};

    this.reviewForm.questions.forEach((question, index) => {
      const controlName = `question_${index}`;

      // Use Validators.required for all question types
      formControls[controlName] = new FormControl('', Validators.required);
    });

    this.form = this.fb.group(formControls);
  }

  // Helper to get the current question
  getQuestion(index: number): Question | undefined {
    return this.reviewForm?.questions[index];
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.notification.showError('Please answer all required questions.');
      return;
    }

    const uniqueLinkId = this.route.snapshot.params['uniqueLinkId'];
    const applicantData = this.form.value;
    console.log(uniqueLinkId);
    console.log(applicantData);

    if (!this.reviewForm) {
      console.error('Exit interview form is not available.');
      this.notification.showError(
        'The form is not available at this time. Please try again later.'
      );
      return;
    }
    const responses = this.reviewForm.questions.map((question, index) => ({
      questionId: question._id, // Use the question's _id as questionId
      answer: applicantData[`question_${index}`],
    }));

    const payload = {
      responses,
    };

    // Submit the responses to the API
    this.service.submitReviewForm(uniqueLinkId, payload).subscribe({
      next: (response: any) => {
        this.notification.showSuccess(
          'Your responses have been submitted successfully!'
        );
        console.log('Form submitted successfully:', response);
        this.form.reset();
      },
      error: (error: any) => {
        console.error('Error submitting form:', error);
        this.notification.showError(
          'There was an error submitting your responses. Please try again.'
        );
      },
    });
  }
}

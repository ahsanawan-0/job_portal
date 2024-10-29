import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ExitInterviewService } from '../../services/exit_interview/exit-interview.service'; // Adjust the path as needed
import { ActivatedRoute } from '@angular/router'; // Import ActivatedRoute
import { Observable } from 'rxjs';

interface ExitInterviewForm {
  title: string;
  questions: Question[];
}

interface Question {
  label: string;
  type: string;
  options?: string[]; // Only for radio type questions
}

@Component({
  selector: 'app-exit-interview-form-viewer',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './exit-interview-form-viewer-component.component.html',
  styleUrls: ['./exit-interview-form-viewer-component.component.css'],
})
export class ExitInterviewFormViewerComponent implements OnInit {
  form: FormGroup;
  exitInterviewForm?: ExitInterviewForm;
  isLoading: boolean = true;
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private exitInterviewService: ExitInterviewService,
    private route: ActivatedRoute // Inject ActivatedRoute
  ) {
    this.form = this.fb.group({});
  }

  ngOnInit(): void {
    // Get the formId from the route parameters
    this.route.params.subscribe((params) => {
      console.log('All params:', params);
      const uniqueLinkId = params['id']; // Assuming your route has a parameter named 'id'
      this.fetchForm(uniqueLinkId);
      console.log('uuid', uniqueLinkId);
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

    // Initialize the form controls
    const formControls: { [key: string]: FormControl } = {
      employeeName: new FormControl('', Validators.required),
      employeeId: new FormControl('', Validators.required),
    };

    this.exitInterviewForm.questions.forEach((question, index) => {
      const controlName = `question_${index}`;

      // Use Validators.required for all question types
      formControls[controlName] = new FormControl('', Validators.required);
    });

    this.form = this.fb.group(formControls);
  }

  // Helper to get the current question
  getQuestion(index: number): Question | undefined {
    return this.exitInterviewForm?.questions[index];
  }

  onSubmit(): void {
    if (this.form.invalid) {
      alert('Please answer all required questions.');
      return;
    }

    const uniqueLinkId = this.route.snapshot.params['id'];
    const applicantData = this.form.value;
    console.log(uniqueLinkId);
    console.log(applicantData);

    if (!this.exitInterviewForm) {
      console.error('Exit interview form is not available.');
      alert('The form is not available at this time. Please try again later.');
      return;
    }
    const responses = this.exitInterviewForm.questions.map(
      (_, index) => applicantData[`question_${index}`]
    );

    const payload = {
      employeeName: applicantData.employeeName,
      employeeId: applicantData.employeeId,
      responses,
    };

    // Submit the responses to the API
    this.exitInterviewService
      .submitExitInterview(uniqueLinkId, payload)
      .subscribe({
        next: (response: any) => {
          alert('Your responses have been submitted successfully!');
          console.log('Form submitted successfully:', response);
          this.form.reset();
        },
        error: (error: any) => {
          console.error('Error submitting form:', error);
          alert(
            'There was an error submitting your responses. Please try again.'
          );
        },
      });
  }
}

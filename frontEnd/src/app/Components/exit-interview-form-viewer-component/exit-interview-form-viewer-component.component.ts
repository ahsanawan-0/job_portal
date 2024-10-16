import { Component, OnInit } from '@angular/core';
import { 
  FormBuilder, 
  FormGroup, 
  FormControl, 
  Validators, 
  ReactiveFormsModule 
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ExitInterviewService } from '../exit-interview.service'; // Adjust the path as needed
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
  templateUrl: './exit-interview-form-viewer.component.html',
  styleUrls: ['./exit-interview-form-viewer.component.css']
})
export class ExitInterviewFormViewerComponent implements OnInit {
  form: FormGroup;
  exitInterviewForm?: ExitInterviewForm;
  isLoading: boolean = true;
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private exitInterviewService: ExitInterviewService
  ) {
    this.form = this.fb.group({});
  }

  ngOnInit(): void {
    this.fetchForm();
  }

  fetchForm(): void {
    this.exitInterviewService.getForm().subscribe({
      next: (data) => {
        this.exitInterviewForm = data;
        this.buildForm();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error fetching form:', error);
        this.errorMessage = 'Failed to load the form. Please try again later.';
        this.isLoading = false;
      }
    });
  }

  buildForm(): void {
    if (!this.exitInterviewForm) return;

    // Initialize the form controls
    const formControls: { [key: string]: FormControl } = {};

    this.exitInterviewForm.questions.forEach((question, index) => {
      const controlName = `question_${index}`;

      if (question.type === 'radio') {
        formControls[controlName] = new FormControl('', Validators.required);
      } else {
        formControls[controlName] = new FormControl('', Validators.required);
      }
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

    const responses = this.form.value;
    console.log('User Responses:', responses);

    // Submit the responses to the API
    this.exitInterviewService.submitForm(responses).subscribe({
      next: (response) => {
        alert('Your responses have been submitted successfully!');
        this.form.reset();
      },
      error: (error) => {
        console.error('Error submitting form:', error);
        alert('There was an error submitting your responses. Please try again.');
      }
    });
  }
}

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TestServiceService } from '../../services/test_service/test-service.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-create-test',
  standalone: true,
  imports: [FormsModule, CommonModule, ReactiveFormsModule],
  templateUrl: './create-test.component.html',
  styleUrls: ['./create-test.component.css'],
})
export class CreateTestComponent implements OnInit {
  form: FormGroup;
  jobs: any[] = [];
  selectedJob: any;
  selectedJobId: string = '';
  isSubmitting: boolean = false; // Flag to indicate submission state

  constructor(
    private fb: FormBuilder,
    private testService: TestServiceService,
    private router: Router
  ) {
    this.form = this.fb.group({
      num_questions: [1, [Validators.required, Validators.min(1)]],
      interview_type: ['', Validators.required],
      experience_level: ['', Validators.required],
      field: ['', Validators.required],
      interview_time: ['', Validators.required],
      job_id: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.fetchActiveJobs();
  }

  fetchActiveJobs(): void {
    this.testService.getActiveJobs().subscribe({
      next: (response) => {
        this.jobs = response.activeJobs;
      },
      error: (error) => {
        console.error('Error fetching jobs:', error);
      },
    });
  }

  onJobSelect(): void {
    const job = this.jobs.find((job) => job._id === this.selectedJobId);
    if (job) {
      this.selectedJob = job;
      this.form.patchValue({
        interview_type: "",
        experience_level: job.experience,
        job_id: job._id,
        field: job.jobTitle,
      });
    }
  }

  generateAIQuestions(): void {
    if (this.form.valid && !this.isSubmitting) { // Check if not submitting
      this.isSubmitting = true; // Set submitting flag
      const formData = this.form.value;
      console.log('Generating AI questions with:', formData);

      this.testService.generateTestQuestion(formData).subscribe({
        next: (response: any) => {
          alert('AI questions generated successfully!');
          console.log('AI questions:', response);
          this.form.reset();
          this.selectedJob = null;
          this.fetchActiveJobs();
          this.isSubmitting = false; // Reset the submitting flag
        },
        error: (error: any) => {
          console.error('Error generating AI questions:', error);
          alert('There was an error generating AI questions.');
          this.isSubmitting = false; // Reset the submitting flag on error
        },
      });
    } else {
      alert('Please fill all required fields.');
    }
  }

  onClickArrowLeft() {
    this.router.navigateByUrl('technicalinterview');
  }

  selectTag(controlName: string, value: string): void {
    this.form.get(controlName)?.setValue(value);
  }
}
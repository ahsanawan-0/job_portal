import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CreateJobService } from '../../services/create_job/create-job.service';
import { PostJob } from '../../models/jobModel';
import { CommonModule } from '@angular/common';
import { TextareaComponent } from '../../Components/textarea/textarea.component';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  imports: [TextareaComponent,ReactiveFormsModule, FormsModule, CommonModule],
standalone:true,
  styleUrls: ['./form.component.css'],
})
export class FormComponent implements OnInit {
  // Reactive form group
  jobForm!: FormGroup;

  // Feedback messages
  successMessage: string = '';
  errorMessage: string = '';
  today: string;

  constructor(
    private formBuilder: FormBuilder,
    private createJobService: CreateJobService
  ) {
    const now = new Date();
    this.today = now.toISOString().slice(0, 16); // Set today's date for expiration date input
  }

  ngOnInit(): void {
    // Initialize form with FormBuilder
    this.jobForm = this.formBuilder.group({
      jobTitle: ['', Validators.required],
      tags: ['', Validators.required],
      location: ['', Validators.required],
      minSalary: [null, [Validators.required, Validators.min(0)]],
      maxSalary: [null, [Validators.required, Validators.min(0)]],
      education: ['', Validators.required],
      experience: ['', Validators.required],
      jobType: ['', Validators.required],
      vacancies: [null, [Validators.required, Validators.min(1)]],
      expirationDate: ['', Validators.required],
      description: ['', Validators.required],
      responsibilities: ['', Validators.required],
    });
  }

  // Submit form and handle post job logic
  submitForm() {
    // if (this.jobForm.invalid) {
    //   this.errorMessage = 'Please fill in all required fields correctly.';
    //   return;
    // }

    const jobData: PostJob = {
      jobTitle: this.jobForm.value.jobTitle,
      tags: this.jobForm.value.tags.split(',').map((tag: string) => tag.trim()),
      location: this.jobForm.value.location,
      minSalary: this.jobForm.value.minSalary,
      maxSalary: this.jobForm.value.maxSalary,
      education: this.jobForm.value.education,
      experience: this.jobForm.value.experience,
      jobType: this.jobForm.value.jobType,
      vacancies: Number(this.jobForm.value.vacancies),
      expirationDate: this.jobForm.value.expirationDate,
      description: this.jobForm.value.description,
      responsibilities: this.jobForm.value.responsibilities,
    };
    
    console.log('Job posted successfully', jobData);
    this.createJobService.postJob(jobData).subscribe({
      next: (response) => {
        this.successMessage = 'Job posted successfully!';
        this.errorMessage = '';

        // Reset the form after successful submission
        this.jobForm.reset();
      },
      error: (error) => {
        console.error('Error posting job', error);
        this.errorMessage =
          error.error.message || 'Error posting job.';
        this.successMessage = '';
      },
    });
  }
}


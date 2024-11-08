import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { CreateJobService } from '../../services/create_job/create-job.service';
import { PostJob } from '../../models/jobModel';
import { TextareaComponent } from '../../Components/textarea/textarea.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-form',
  standalone: true,
  imports: [TextareaComponent, FormsModule, CommonModule],
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css'],
})
export class FormComponent {
  // Form fields bound via ngModel
  jobTitle: string = '';
  tags: string = '';
  location: string = '';
  minSalary!: number;
  maxSalary!: number;
  education: string = '';
  experience: string = '';
  jobType: string = '';
  vacancies!: number;
  expirationDate: string = '';
  description: string = '';
  responsibilities: string = '';

  // Feedback messages
  successMessage: string = '';
  errorMessage: string = '';
  today: string;
  isPosting: boolean = false; // Flag to manage button state

  constructor(private createJobService: CreateJobService, private router: Router) {
    const now = new Date();
    this.today = now.toISOString().slice(0, 16); // Format today's date
  }

  // Submit handler
  submitForm(form: NgForm) {
    if (form.invalid) {
      this.errorMessage = 'Please fill in all required fields correctly.';
      this.logFormStatus(form);
      return;
    }

    this.isPosting = true; // Set posting state to true
    const jobData: PostJob = this.prepareJobData();

    console.log('Submitting job data:', jobData); // Debugging

    this.createJobService.postJob(jobData).subscribe({
      next: (response) => {
        console.log('Job posted successfully', response);
        this.successMessage = 'Job posted successfully!';
        this.errorMessage = '';
        this.resetFields(); // Clear fields after submission
        form.resetForm(); // Reset the form
        this.router.navigate(['/dashboard']); // Redirect to dashboard
      },
      error: (error) => {
        console.error('Error posting job', error);
        this.errorMessage = error.error.message || 'Error posting job.';
        this.successMessage = '';
      },
      complete: () => {
        this.isPosting = false; // Reset posting state
      }
    });
  }

  // Prepare job data for submission
  prepareJobData(): PostJob {
    return {
      jobTitle: this.jobTitle,
      tags: this.tags.split(',').map(tag => tag.trim()),
      location: this.location,
      minSalary: this.minSalary,
      maxSalary: this.maxSalary,
      education: this.education,
      experience: this.experience,
      jobType: this.jobType,
      vacancies: Number(this.vacancies),
      expirationDate: this.expirationDate,
      description: this.description,
      responsibilities: this.responsibilities,
    };
  }

  // Log form status for debugging
  logFormStatus(form: NgForm): void {
    console.log('Form Valid:', form.valid);
    Object.keys(form.controls).forEach(key => {
      const control = form.controls[key];
      console.log(`Control: ${key}, Valid: ${control.valid}, Errors:`, control.errors);
    });
  }

  // Method to reset form fields
  resetFields(): void {
    this.jobTitle = '';
    this.tags = '';
    this.location = '';
    this.minSalary = undefined!;
    this.maxSalary = undefined!;
    this.education = '';
    this.experience = '';
    this.jobType = '';
    this.vacancies = undefined!;
    this.expirationDate = '';
    this.description = '';
    this.responsibilities = '';
  }
}
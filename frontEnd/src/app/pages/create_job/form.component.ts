import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { CreateJobService } from '../../services/create_job/create-job.service'; // Adjust the path as necessary
import { PostJob } from '../../models/jobModel'; // Adjust the path to your job model
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
  tags: string = ''; // Keeping as string to handle comma-separated input
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
  constructor(private createJobService: CreateJobService) {
    const now = new Date();
    // Format today's date to yyyy-MM-ddTHH:mm for the datetime-local input
    this.today = now.toISOString().slice(0, 16);
  }

  // Submit handler
  submitForm(form: NgForm) {
    if (form.invalid) {
      this.errorMessage = 'Please fill in all required fields correctly.';

      // Debugging: Log form validity and control statuses
      console.log('Form Valid:', form.valid);
      Object.keys(form.controls).forEach((key) => {
        const control = form.controls[key];
        console.log(
          `Control: ${key}, Valid: ${control.valid}, Errors:`,
          control.errors
        );
      });

      return;
    }

    const jobData: PostJob = {
      jobTitle: this.jobTitle,
      tags: this.tags.split(',').map((tag) => tag.trim()), // Convert comma-separated string to array
      location: this.location,
      minSalary: this.minSalary,
      maxSalary: this.maxSalary,
      education: this.education,
      experience: this.experience,
      jobType: this.jobType,
      vacancies: Number(this.vacancies), // Convert to number
      expirationDate: this.expirationDate,
      description: this.description,
      responsibilities: this.responsibilities,
    };

    console.log('Submitting job data:', jobData); // Add this line for debugging

    this.createJobService.postJob(jobData).subscribe({
      next: (response) => {
        console.log('Job posted successfully', response);
        this.successMessage = 'Job posted successfully!';
        this.errorMessage = '';
        this.resetFields(); // Clear the fields after submission
        form.resetForm(); // Reset the form after successful submission
      },
      error: (error) => {
        console.error('Error posting job', error);
        // Display a user-friendly error message
        this.errorMessage = error.error.message || 'Error posting job.';
        this.successMessage = '';
      },
    });
  }

  // Method to reset form fields
  resetFields() {
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
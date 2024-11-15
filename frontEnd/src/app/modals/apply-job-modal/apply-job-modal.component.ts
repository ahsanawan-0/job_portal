import { Subscription } from 'rxjs';
import { Component, OnDestroy, OnInit, inject, Input } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2'; // Import SweetAlert2
import { TextareaComponent } from '../../Components/textarea/textarea.component';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JobApplicationService } from '../../services/job_application/job-application.service';
import { NotificationService } from '../../services/notification/notification.service';

@Component({
  selector: 'app-apply-job-modal',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, TextareaComponent],
  templateUrl: './apply-job-modal.component.html',
  styleUrls: ['./apply-job-modal.component.scss'],
  providers: [JobApplicationService],
})
export class ApplyJobModalComponent implements OnInit, OnDestroy {
  notification = inject(NotificationService);
  @Input() jobId: string | null = null; // Input property for jobId
  @Input() jobTitle: string | null = null; // Input property for jobId
  
  applicationForm: FormGroup;
  loading = false; // Add loading state

  private subscriptions: Subscription = new Subscription();
  selectedResume: File | null = null; // Store selected file
  fileName: string | null = null; // Store the name of the selected file

  // Use inject() to get dependencies
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private jobApplicationService = inject(JobApplicationService);
  public activeModal = inject(NgbActiveModal);

  constructor() {
    this.applicationForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      experience: ['', Validators.required],
      resume: [null, Validators.required], // Keep as a FormControl for file input
      coverLetter: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    console.log('Received jobId:', this.jobId); // Log the received jobId
    console.log('Received jobtitle:', this.jobTitle); // Log the received jobId
  }

  // Handle file selection
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedResume = input.files[0]; // Store the selected file
      this.fileName = this.selectedResume.name; // Set the file name for display

      // Update the FormControl with the selected file
      this.applicationForm.patchValue({ resume: this.selectedResume });
      // Trigger validation
      this.applicationForm.get('resume')?.updateValueAndValidity();
    } else {
      this.resetFileSelection();
    }
  }

  // Reset file selection
  private resetFileSelection(): void {
    this.selectedResume = null; // Reset if no file is selected
    this.fileName = null; // Reset file name
    this.applicationForm.patchValue({ resume: null }); // Reset the FormControl
  }

  // Submit the application
  // Submit the application
  submitApplication(): void {
    if (this.applicationForm.valid && this.selectedResume) {
      const formData = this.createFormData();

      // Check if jobId is defined
      if (!this.jobId) {
        this.notification.showError('Job ID is missing. Please try again.');
        return;
      }

      this.loading = true; // Start loading
      this.jobApplicationService.getApplication(formData, this.jobId).subscribe({
        next: (response) => {
          this.loading = false; // Stop loading on success
          this.notification.showSuccess('Thank you for applying. Please check your confirmation email.');
          this.resetForm();
          this.closeModal();
        },
        error: (error) => {
          this.loading = false; // Stop loading on error
          const errorMessage = error.error?.error || 'There was an error submitting your application. Please try again.';
          if (errorMessage === 'A user with this email already exists.') {
            this.notification.showError('A user with this email already exists. Please use a different email.');
          } else {
            this.notification.showError(errorMessage);
          }
        },
      });
    } else {
      this.notification.showError('Please fill out all fields correctly.');
    }
  }


  // Create FormData object
  private createFormData(): FormData {
    const formData = new FormData();
    formData.append('name', this.applicationForm.get('name')?.value);
    formData.append('email', this.applicationForm.get('email')?.value);
    formData.append(
      'experience',
      this.applicationForm.get('experience')?.value
    );
    formData.append('resume', this.selectedResume!, this.selectedResume!.name); // Add the file with its name
    formData.append(
      'coverLetter',
      this.applicationForm.get('coverLetter')?.value
    );
    formData.append('jobId', this.jobId!); // Include jobId in the FormData
    return formData;
  }

  // Show success alert using SweetAlert2
  private showSuccessAlert(): void {
    Swal.fire({
      title: 'Application Submitted!',
      text: 'Thank you for applying. Please check your confirmation email.',
      icon: 'success',
      showConfirmButton: false,
      timer: 3000, // Displays the modal for 3 seconds
      willClose: () => {
        this.closePage(); // Call method to close the page
      },
    });
  }

  // Show error alert using SweetAlert2
  private showErrorAlert(message: string): void {
    Swal.fire({
      title: 'Error!',
      text: message,
      icon: 'error',
      confirmButtonText: 'Try Again',
    });
  }

  // Reset form and selected file
  private resetForm(): void {
    this.applicationForm.reset();
    this.resetFileSelection();
  }

  // Close the modal
  closeModal(): void {
    this.activeModal.close(); // Use activeModal to close the modal
  }

  // Method to close the page
  private closePage(): void {
    window.close(); // Closes the current tab
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe(); // Clean up subscriptions
  }
}

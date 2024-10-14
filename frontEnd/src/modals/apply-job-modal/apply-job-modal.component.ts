import { Subscription } from 'rxjs';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2'; // Import SweetAlert2
import { TextareaComponent } from '../../Components/textarea/textarea.component';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { JobApplicationService } from '../../services/job_application/job-application.service';

@Component({
  selector: 'app-apply-job-modal',
  standalone: true,
  imports: [FormsModule, CommonModule, TextareaComponent, ReactiveFormsModule],
  templateUrl: './apply-job-modal.component.html',
  styleUrls: ['./apply-job-modal.component.scss'],
  providers: [JobApplicationService],
})
export class ApplyJobModalComponent implements OnInit, OnDestroy {
  applicationForm: FormGroup;
  private subscriptions: Subscription = new Subscription();
  selectedResume: File | null = null; // Store selected file
  fileName: string | null = null; // Store the name of the selected file

  // Use inject() to get dependencies
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private jobApplicationService = inject(JobApplicationService);
  private modalService = inject(NgbModal);
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
    // Any additional initialization can go here
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
  submitApplication(): void {
    if (this.applicationForm.valid && this.selectedResume) {
      const formData = this.createFormData();

      // Call the service to submit the application
      this.jobApplicationService.getApplication(formData).subscribe({
        next: (response) => {
          console.log('Application submitted:', response);
          this.showSuccessAlert();
          this.resetForm();
          this.closeModal();
          this.router.navigate(['/home']); // Redirect to desired route
        },
        error: (error) => {
          console.error('Error submitting application:', error);
          this.showErrorAlert('There was an error submitting your application. Please try again.');
        },
      });
    } else {
      this.showErrorAlert('Please fill out all fields correctly.');
    }
  }

  // Create FormData object
  private createFormData(): FormData {
    const formData = new FormData();
    formData.append('name', this.applicationForm.get('name')?.value);
    formData.append('email', this.applicationForm.get('email')?.value);
    formData.append('experience', this.applicationForm.get('experience')?.value);
    formData.append('resume', this.selectedResume!, this.selectedResume!.name); // Add the file with its name
    formData.append('coverLetter', this.applicationForm.get('coverLetter')?.value);
    return formData;
  }

  // Show success alert using SweetAlert2
  private showSuccessAlert(): void {
    Swal.fire({
      title: 'Success!',
      text: 'Your application has been submitted successfully.',
      icon: 'success',
      confirmButtonText: 'OK',
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
    this.modalService.dismissAll(); // Close the modal using the modal service
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe(); // Clean up subscriptions
  }
}

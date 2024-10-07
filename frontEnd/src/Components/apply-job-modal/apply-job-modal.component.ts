import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-apply-job-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './apply-job-modal.component.html',
  styleUrls: ['./apply-job-modal.component.css']
})
export class ApplyJobModalComponent {
  @Input() isVisible = false;  // Controls modal visibility

  coverLetter: string = '';
  selectedFile: File | null = null;

  // Close the modal
  closeModal() {
    this.isVisible = false;
  }

  // Handle file selection for resume upload
  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  // Handle form submission
  submitApplication() {
    if (this.coverLetter && this.selectedFile) {
      // Implement your form submission logic here
      console.log('Cover Letter:', this.coverLetter);
      console.log('Selected Resume File:', this.selectedFile);

      // Optionally, reset form fields
      this.coverLetter = '';
      this.selectedFile = null;

      // Close the modal after submission
      this.closeModal();
    } else {
      alert('Please fill in the cover letter and upload your resume.');
    }
  }
}

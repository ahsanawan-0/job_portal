import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { ApplyJobModalComponent } from '../../modals/apply-job-modal/apply-job-modal.component';
import { FormsModule } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CreateJobService } from '../../Services/create_job/create-job.service';

@Component({
  selector: 'app-job-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, ApplyJobModalComponent], // Ensure ApplyJobModalComponent is imported if used in the template
  templateUrl: './job-detail.component.html',
  styleUrls: ['./job-detail.component.css'],
})
export class JobDetailComponent implements OnInit {
  private modalService = inject(NgbModal);
  private createJobService = inject(CreateJobService);

  job: any; // To store job details
  jobId: string = '67094376e7de8c161a0093b3'; // Replace this with the actual job ID you want to fetch

  // Solution 1: Use definite assignment assertion

  // Alternative Solutions:
  // safeDescription: SafeHtml | undefined; // Solution 3: Marking as optional
  // safeDescription: SafeHtml = ''; // Solution 2: Initialize with a default value

  ngOnInit() {
    this.getJobDetails();
  }

  // Function to fetch job details by ID
  getJobDetails() {
    this.createJobService.getJobById(this.jobId).subscribe(
      (data) => {
        console.log('API Response:', data); // Debugging step
        this.job = data.job; // Assuming your API sends { job: {...} }
        // this.safeDescription = this.sanitizer.bypassSecurityTrustHtml(this.job.description); // Sanitize the HTML
      },
      (error) => {
        console.error('Error fetching job details:', error);
      }
    );
  }

  openApplyModal() {
    const modalRef = this.modalService.open(ApplyJobModalComponent);
  }
}

import { Component, inject, OnInit } from '@angular/core';
import { ApplyJobModalComponent } from '../../modals/apply-job-modal/apply-job-modal.component';
import { FormsModule } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CreateJobService } from '../../services/create_job/create-job.service';
import { SharedModule } from '../../sharedModules/shared.module';
import { Job } from '../../models/jobModel'; // Adjust the import path as necessary
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-job-view-page',
  standalone: true,
  imports: [CommonModule, FormsModule, ApplyJobModalComponent, SharedModule],
  templateUrl: './job-view-page.component.html',
  styleUrls: ['./job-view-page.component.css'],
})
export class JobViewPageComponent implements OnInit {
  private modalService = inject(NgbModal);
  private createJobService = inject(CreateJobService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  job: any;
  jobId: string = '';
  loading: boolean = false;

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      this.jobId = params.get('id') || '';
      if (this.jobId) {
        this.getJobDetails();
      }
    });
  }

  getJobDetails() {
    this.createJobService.getJobById(this.jobId).subscribe(
      (data) => {
        console.log('API Response:', data);
        this.job = data.job;
      },
      (error) => {
        console.error('Error fetching job details:', error);
      }
    );
  }

  openApplyModal(jobTitle:string) {
    const modalRef = this.modalService.open(ApplyJobModalComponent);
    modalRef.componentInstance.jobId = this.jobId; // Pass jobId to the modal
    modalRef.componentInstance.jobTitle = jobTitle; // Pass jobId to the modal
  }
}

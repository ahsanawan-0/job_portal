import { Component, inject, OnInit } from '@angular/core';
import { ApplyJobModalComponent } from '../../modals/apply-job-modal/apply-job-modal.component';
import { FormsModule } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CreateJobService } from '../../services/create_job/create-job.service';
import { SharedModule } from '../../sharedModules/shared.module';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';
import { Job } from '../../models/jobModel'; // Adjust the import path as necessary
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-job-view-page', // Updated selector
  standalone: true,
  imports: [CommonModule, FormsModule, ApplyJobModalComponent, SharedModule],
  templateUrl: './job-view-page.component.html', // Updated template URL
  styleUrls: ['./job-view-page.component.css'], // Updated style URL
})
export class JobViewPageComponent implements OnInit {
  // Updated class name
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

  openApplyModal() {
    const modalRef = this.modalService.open(ApplyJobModalComponent);
  }
}

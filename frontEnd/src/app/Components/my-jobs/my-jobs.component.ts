import { CommonModule, UpperCasePipe } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { PaginationComponent } from '../pagination/pagination.component';
import { Router } from '@angular/router';
import { CreateJobService } from '../../services/create_job/create-job.service';
import { JobCardComponentComponent } from '../job-card-component/job-card-component.component';
import { jobCard } from '../../models/jobModel';

@Component({
  selector: 'app-my-jobs',
  standalone: true,
  imports: [
    UpperCasePipe,
    CommonModule,
    PaginationComponent,
    JobCardComponentComponent,
  ],
  templateUrl: './my-jobs.component.html',
  styleUrl: './my-jobs.component.css',
})
export class MyJobsComponent implements OnInit {
  route = inject(Router);
  onClickPostJob() {
    this.route.navigateByUrl('createJobPost');
  }

  dropdownIndex: number | null = null;

  job: any[] = [];
  service = inject(CreateJobService);

  ngOnInit(): void {
    this.getAllJobs();
  }
  totalItems: number = 0;
  itemsPerPage = 4;
  currentPage = 1;
  paginatedJobs: jobCard[] = [];

  getAllJobs(): void {
    this.service.getAllJobs(this.currentPage).subscribe(
      (res: any) => {
        this.job = res.simplifiedJobs.map((job: any) => ({
          id: job.id,
          title: job.jobTitle,
          type: job.jobType,
          remaining: this.calculateRemainingDays(job.expirationDate),
          status: job.status,
          applications: job.noOfApplications,
        }));
        console.log('jobs:', this.job);

        this.totalItems = res.totalJobs;
        this.updatePaginatedJobs();
        console.log('Paginated Jobs:', this.paginatedJobs);
      },
      (error) => {
        console.error('Error fetching jobs:', error);
      }
    );
  }

  calculateRemainingDays(expirationDate: string): string {
    const now = new Date();
    const expiration = new Date(expirationDate);

    const remainingTime = expiration.getTime() - now.getTime();
    const daysRemaining = Math.ceil(remainingTime / (1000 * 3600 * 24));
    if (daysRemaining > 1) {
      return `${daysRemaining} days remaining`;
    } else if (daysRemaining === 1) {
      return '1 day remaining';
    } else {
      const options = {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        timeZone: 'UTC',
      } as const;
      return expiration.toLocaleDateString('en-US', options);
    }
  }

  onClickThreeDots(index: number) {
    if (this.dropdownIndex === index) {
      this.dropdownIndex = null;
    } else {
      this.dropdownIndex = index;
    }
  }

  onClickViewApplication(jobId: string) {
    this.route.navigateByUrl(`job-applications/${jobId}`);
  }

  onPageChange(page: number): void {
    this.currentPage = page;

    this.getAllJobs();
    console.log('Current Page:', this.currentPage);
  }

  updatePaginatedJobs(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    console.log('start index', startIndex);
    console.log('end index', endIndex);
    console.log('before slicing ', this.job);
    console.log('before slicing paginated jobs ', this.paginatedJobs);
    this.paginatedJobs = this.job;
    console.log('after slicing ', this.job);
    console.log('after slicing paginated jobs ', this.paginatedJobs);
  }
}

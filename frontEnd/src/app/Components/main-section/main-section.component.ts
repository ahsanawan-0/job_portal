import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { JobApplicationService } from '../../services/job_application/job-application.service';
import { Router } from '@angular/router';
import { TestComponent } from '../test/test.component';
import { JobCardComponentComponent } from '../job-card-component/job-card-component.component';
import { CreateJobService } from '../../services/create_job/create-job.service';
import { jobCard } from '../../models/jobModel';

@Component({
  selector: 'app-main-section',
  standalone: true,
  imports: [CommonModule, JobCardComponentComponent],
  templateUrl: './main-section.component.html',
  styleUrl: './main-section.component.css',
})
export class MainSectionComponent implements OnInit {
  jobs: jobCard[] = [];
  dropdown: boolean = false;
  onClickThreeDots() {
    this.dropdown = !this.dropdown;
  }

  route = inject(Router);
  onClickViewAll() {
    this.route.navigateByUrl('myjobs');
  }

  applications: any[] = [];
  service = inject(CreateJobService);

  ngOnInit(): void {
    this.getApplications();
    console.log(this.applications);
  }

  getApplications() {
    this.service.getAllJobs().subscribe((res: any) => {
      this.jobs = res.simplifiedJobs.map((job: any) => ({
        title: job.jobTitle,
        type: job.jobType,
        remaining: this.calculateRemainingDays(job.expirationDate),
        status: job.status,
        applications: job.noOfApplications,
      }));
      console.log(this.jobs);
    });
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
      return 'Expired';
    }
  }
}

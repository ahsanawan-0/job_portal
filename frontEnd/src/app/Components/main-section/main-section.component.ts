import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { JobApplicationService } from '../../services/job_application/job-application.service';
import { Router } from '@angular/router';
import { TestComponent } from '../test/test.component';
import { JobCardComponentComponent } from '../job-card-component/job-card-component.component';
import { CreateJobService } from '../../services/create_job/create-job.service';

@Component({
  selector: 'app-main-section',
  standalone: true,
  imports: [CommonModule, JobCardComponentComponent],
  templateUrl: './main-section.component.html',
  styleUrl: './main-section.component.css',
})
export class MainSectionComponent implements OnInit {
  jobs = [
    {
      title: 'UI/UI Designer',
      type: 'Full Time',
      remaining: '27 ',
      status: 'Active',
      applications: '798 ',
    },
  ];

  dropdown: boolean = false;
  onClickThreeDots() {
    this.dropdown = !this.dropdown;
  }

  route = inject(Router);
  onClickViewAll() {
    this.route.navigateByUrl('myjobs');
  }

  applications: [] = [];
  service = inject(CreateJobService);

  ngOnInit(): void {
    this.getApplications();
  }

  getApplications() {
    this.service.getAllJobs().subscribe((res: any) => {
      this.applications = res;
    });
  }
}

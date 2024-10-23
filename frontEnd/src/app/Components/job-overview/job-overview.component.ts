import { Component, inject, OnInit } from '@angular/core';
import { CreateJobService } from '../../services/create_job/create-job.service';

@Component({
  selector: 'app-job-overview',
  standalone: true,
  imports: [],
  templateUrl: './job-overview.component.html',
  styleUrl: './job-overview.component.css',
})
export class JobOverviewComponent implements OnInit {
  service = inject(CreateJobService);

  jobcount: number = 0;
  expiredJobCount: number = 0;
  activeJobCount: number = 0;

  ngOnInit(): void {
    this.getAllJobs();
  }

  getAllJobs() {
    this.service.getAllJobsForCount().subscribe((res: any) => {
      this.jobcount = res.totalJobs;
      this.expiredJobCount = res.expiredJobs;
      this.activeJobCount = res.activeJobs;
      console.log('Active Jobs Count:', this.activeJobCount);
      console.log('Expired Jobs Count:', this.expiredJobCount);
    });
  }
}

import { CommonModule } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
import { jobCard } from '../../models/jobModel';
import { Router } from '@angular/router';
import { CreateJobService } from '../../services/create_job/create-job.service';

@Component({
  selector: 'app-job-card-component',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './job-card-component.component.html',
  styleUrl: './job-card-component.component.css',
})
export class JobCardComponentComponent {
  // dropdown: boolean = false;
  // onClickThreeDots() {
  //   this.dropdown = !this.dropdown;
  //   console.log(this.dropdown);
  // }
  @Input() jobs: jobCard[] = [];
  // @Input() onViewApplications: () => void = () => {};

  dropdownIndex: number | null = null;
  onClickThreeDots(index: number) {
    if (this.dropdownIndex === index) {
      this.dropdownIndex = null;
    } else {
      this.dropdownIndex = index;
    }
  }

  service = inject(CreateJobService);

  route = inject(Router);
  onClickViewApplication(jobId: string) {
    this.route.navigateByUrl(`job-applications/${jobId}`);
  }
}

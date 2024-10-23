import { CommonModule, DatePipe } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';

import { Router } from '@angular/router';
import { JobApplicationService } from '../../services/job_application/job-application.service';

@Component({
  selector: 'app-job-applications',
  standalone: true,
  imports: [CommonModule, DatePipe],
  templateUrl: './job-applications.component.html',
  styleUrl: './job-applications.component.css',
})
export class JobApplicationsComponent implements OnInit {
  route = inject(Router);
  onClickArrowLeft() {
    this.route.navigateByUrl('myjobs');
  }
  isDropdownVisible = signal(false);

  toggleDropdown() {
    this.isDropdownVisible.update((prev) => !prev);
  }

  // dropdown: boolean = false;
  // onClickThreeDots() {
  //   this.dropdown = !this.dropdown;
  // }

  dropdown: { [key: number]: boolean } = {};
  onClickThreeDots(index: number) {
    this.dropdown[index] = !this.dropdown[index];
  }

  ngOnInit(): void {
    this.getAllApplications();
  }

  totalApplicants: number = 0;
  applications: any[] = [];
  service = inject(JobApplicationService);

  getAllApplications() {
    this.service.getAllApplications().subscribe((res: any) => {
      this.applications = res.response;
      this.totalApplicants = res.totalApplicants;
      console.log('total applicants', this.totalApplicants);
    });
  }
}

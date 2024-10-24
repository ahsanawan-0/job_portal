import { CommonModule, DatePipe } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { alert, notice } from '@pnotify/core';
import { ActivatedRoute, Router } from '@angular/router';
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

  activatedRoute = inject(ActivatedRoute);
  jobId: string | null = null;
  totalApplicants: number = 0;
  jobTitle: string = '';
  applicants: any[] = [];

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe((params) => {
      this.jobId = params.get('id');
      console.log(this.jobId);
    });
    this.getApplicantsForJob();
    this.getAllShortListedApplicants();
  }

  service = inject(JobApplicationService);

  getApplicantsForJob() {
    this.service.getApplicantsForJob(this.jobId).subscribe((res: any) => {
      this.applicants = res.response.applicants;
      this.totalApplicants = res.totalApplicants;
      this.jobTitle = res.response.jobTitle;
    });
  }
  shortListed: any[] = [];
  createShortListedApplicant(applicantId: string) {
    this.service
      .createShortlistedApplicant(this.jobId, applicantId)
      .subscribe((res: any) => {
        this.shortListed = res.response;
      });
    this.getApplicantsForJob();
    this.getAllShortListedApplicants();
  }
  shortListedArray: any[] = [];
  shortListedCount: number = 0;

  getAllShortListedApplicants() {
    this.service
      .getAllShortListedApplicants(this.jobId)
      .subscribe((res: any) => {
        this.shortListedArray = res.response.shortListedApplicants;
        this.shortListedCount = res.totalApplicants;
      });
  }
  isShortListed(applicantId: string): boolean {
    return this.shortListedArray.includes(applicantId);
  }
}

import { CommonModule, DatePipe } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { JobApplicationService } from '../../services/job_application/job-application.service';
import { CapitalizeWordsPipe } from '../../Pipes/capitalize-words.pipe';
import { NotificationService } from '../../services/notification/notification.service';

@Component({
  selector: 'app-job-applications',
  standalone: true,
  imports: [CommonModule, DatePipe, CapitalizeWordsPipe],
  templateUrl: './job-applications.component.html',
  styleUrl: './job-applications.component.css',
})
export class JobApplicationsComponent implements OnInit {
  notification = inject(NotificationService);
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
  jobExpirationDate: string | null = null;
  jobStatus: string = '';

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe((params) => {
      this.jobId = params.get('id');
    });
    this.getApplicantsForJob();
    this.getAllShortListedApplicants();
    this.getAllTestInvitedApplicants();
    this.getAllHiredApplicants();
  }

  service = inject(JobApplicationService);

  getApplicantsForJob() {
    this.service.getApplicantsForJob(this.jobId).subscribe((res: any) => {
      this.applicants = res.response.applicants;
      this.totalApplicants = res.totalApplicants;
      this.jobTitle = res.response.jobTitle;
      this.jobExpirationDate = res.response.expirationDate;
      this.jobStatus = res.response.status;

      this.extractApplicantId();
    });
  }
  shortListed: any[] = [];
  createShortListedApplicant(applicantId: string) {
    this.service
      .createShortlistedApplicant(this.jobId, applicantId)
      .subscribe((res: any) => {
        this.shortListed = res.response;
        this.notification.showSuccess('Applicant is ShortListed!');
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
        console.log('shortListed', this.shortListedArray);
        this.shortListedCount = res.totalApplicants;
        this.extractShortListedId();
      });
  }

  shortListedId: any[] = [];
  extractShortListedId() {
    this.shortListedId = this.shortListedArray.map((id) => id._id);
    console.log(this.shortListedId);
  }

  applicantId: any[] = [];
  extractApplicantId() {
    this.applicantId = this.applicants.map((id) => id._id);
    console.log(this.applicantId);
    console.log('expired boolean', this.isJobExpired());
  }

  isJobExpired(): boolean {
    if (this.jobStatus === 'Expired') {
      return true;
    }
    return false;
    // const expirationDate = new Date(this.jobExpirationDate);
    // return new Date() > expirationDate;
  }

  isShortListed(applicantId: string): boolean {
    return this.shortListedId.includes(applicantId);
  }

  testInvited: any[] = [];
  createShortListedApplicantsForJob(applicantId: string) {
    this.service
      .createTestInvitedApplicantsForJob(this.jobId, applicantId)
      .subscribe((res: any) => {
        this.testInvited = res.response;
        this.notification.showSuccess('Applicant is Invited For Test!');
      });
    this.getApplicantsForJob();
    this.getAllTestInvitedApplicants();
  }

  testInvitedArray: any[] = [];
  testInvitedCount: number = 0;

  getAllTestInvitedApplicants() {
    this.service
      .getAllTestInvitedApplicants(this.jobId)
      .subscribe((res: any) => {
        this.testInvitedArray = res.response.testInvitedApplicants;
        console.log('testInvited', this.shortListedArray);
        this.testInvitedCount = res.totalApplicants;
        this.extractTestInvitedId();
      });
  }

  testInvitedId: any[] = [];
  extractTestInvitedId() {
    this.testInvitedId = this.testInvitedArray.map((id) => id._id);
    console.log(this.testInvitedId);
  }

  isTestInvited(applicantId: string): boolean {
    return this.testInvitedId.includes(applicantId);
  }

  hiredApplicant: any[] = [];
  createHiredApplicantsForJob(applicantId: string) {
    this.service
      .createHiredApplicantsForJob(this.jobId, applicantId)
      .subscribe((res: any) => {
        this.hiredApplicant = res.response;
        this.notification.showSuccess('Applicant is Hired!');
      });
    this.getApplicantsForJob();
    this.getAllHiredApplicants();
  }

  hiredApplicantArray: any[] = [];
  hiredApplicantCount: number = 0;

  getAllHiredApplicants() {
    this.service.getAllHiredApplicants(this.jobId).subscribe((res: any) => {
      this.hiredApplicantArray = res.response.hiredApplicants;
      console.log('hired', this.hiredApplicantArray);
      this.hiredApplicantCount = res.totalApplicants;
      this.extractHiredId();
    });
  }

  hiredId: any[] = [];
  extractHiredId() {
    this.hiredId = this.hiredApplicantArray.map((id) => id._id);
    console.log(this.hiredId);
  }

  isHired(applicantId: string): boolean {
    return this.hiredId.includes(applicantId);
  }
}

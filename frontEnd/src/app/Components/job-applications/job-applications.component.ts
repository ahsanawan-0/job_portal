import { CommonModule, DatePipe } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { alert, notice } from '@pnotify/core';
import { ActivatedRoute, Router } from '@angular/router';
import { JobApplicationService } from '../../services/job_application/job-application.service';
import { CapitalizeWordsPipe } from '../../Pipes/capitalize-words.pipe';
import { success, error } from '@pnotify/core';
import '@pnotify/core/dist/PNotify.css';
import '@pnotify/core/dist/BrightTheme.css';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TetsFormsListComponent } from '../../modals/tets-forms-list/tets-forms-list.component';

@Component({
  selector: 'app-job-applications',
  standalone: true,
  imports: [CommonModule, DatePipe, CapitalizeWordsPipe,TetsFormsListComponent],
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
  jobId!: string | null; // Using non-null assertion operator to avoid initialization error
  totalApplicants: number = 0;
  jobTitle: string = '';
  applicants: any[] = [];
  jobExpirationDate: string | null = null;
  jobStatus: string = '';
  resumeLoading: boolean = false; // Add a loading state variable


  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe((params) => {
      this.jobId = params.get('id');
      console.log(this.jobId);
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
        success({
          text: 'Applicant is ShortListed!',
          delay: 3000,
          width: '300px',
        });
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
  createShortListedApplicantsForJob(applicantId: string ,testId: string) {
    this.service
    .createTestInvitedApplicantsForJob(this.jobId, applicantId, testId)
      .subscribe((res: any) => {
        this.testInvited = res.response;
        success({
          text: 'Applicant is Invited For Test!',
          delay: 3000,
          width: '300px',
        });
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
        success({
          text: 'Applicant is Hired!',
          delay: 3000,
          width: '300px',
        });
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

  downloadResume(resumeId: string) {
    this.resumeLoading = true; // Start loading

    this.service.getFileById(resumeId).subscribe(
      (response: any) => {
        if (response?.data?.webContentLink) {
          // Create an anchor element to trigger the download
          const anchor = document.createElement('a');
          anchor.href = response.data.webContentLink;
          anchor.target = '_blank'; // Optional: opens in a new tab
          anchor.download = response.data.name; // Optional: filename if needed
          anchor.click();
          this.resumeLoading = false; // Stop loading

        } else {
          console.error("Download link not available");
          this.resumeLoading = false; // Stop loading on error

        }
      },
      (error:any) => {
        console.error("Error fetching file data:", error);
      }
    );
  }
  private modalService = inject(NgbModal);
  openTestSelectionModal(applicantId: string) {
    // Find the shortlisted applicant's information based on the ID
    const applicant = this.shortListedArray.find(app => app._id === applicantId);
  
    if (!applicant) {
      console.error(`Shortlisted applicant with ID ${applicantId} not found`);
      return; // Early exit if applicant not found
    }
  
    const modalRef = this.modalService.open(TetsFormsListComponent, {
      size: 'lg',
      backdrop: 'static',
    });
  
    // Pass the jobId, applicantId, and applicantName to the modal
    modalRef.componentInstance.jobId = this.jobId; // Pass the job ID
    modalRef.componentInstance.applicantId = applicantId; // Pass the applicant ID
    modalRef.componentInstance.applicantName = applicant.name; // Pass the applicant name
  
    // Handle the test selection within the modal
    modalRef.componentInstance.invitationSent.subscribe(() => {
      this.getAllTestInvitedApplicants(); // Refresh the list of invited applicants
    });
  }
  inviteApplicantToTest(applicantId: string, testId: string) {
    this.service
      .createTestInvitedApplicantsForJob(this.jobId, applicantId, testId)
      .subscribe((res: any) => {
        // Refresh or update as needed
        success({
          text: 'Applicant invited for the selected test!',
          delay: 3000,
          width: '300px',
        });
        this.getAllTestInvitedApplicants();
      });
  }
  
}

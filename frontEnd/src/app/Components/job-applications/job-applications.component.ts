import { CommonModule, DatePipe } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { JobApplicationService } from '../../services/job_application/job-application.service';
import { CapitalizeWordsPipe } from '../../Pipes/capitalize-words.pipe';
import { NotificationService } from '../../services/notification/notification.service';
import { success, error } from '@pnotify/core';
import '@pnotify/core/dist/PNotify.css';
import '@pnotify/core/dist/BrightTheme.css';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TetsFormsListComponent } from '../../modals/tets-forms-list/tets-forms-list.component';
import { DeleteConfirmationModalComponent } from '../../modals/delete-confirmation-modal/delete-confirmation-modal.component';
import { ApplicantsResponse, ShortApplicantsResponse, TestInvitedApplicants } from '../../models/jobModel';

@Component({
  selector: 'app-job-applications',
  standalone: true,
  imports: [
    CommonModule,
    DatePipe,
    CapitalizeWordsPipe,
    TetsFormsListComponent,
  ],
  templateUrl: './job-applications.component.html',
  styleUrl: './job-applications.component.css',
})
export class JobApplicationsComponent implements OnInit {
  notification = inject(NotificationService);
  route = inject(Router);
  showTooltip: boolean = false;

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
  resumeIndex: number | null = null;
  resumeLoading: { [key: string]: boolean } = {};
  resumeViewLoading: { [key: string]: boolean } = {};

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe((params) => {
      this.jobId = params.get('id');
    });
    this.getApplicantsForJob();
    this.getAllShortListedApplicants();
    this.getAllTestInvitedApplicants();
    this.getAllHiredApplicants();
    this.getAllOnsiteApplicants();
  }

  service = inject(JobApplicationService);
  
  getApplicantsForJob() {
    this.service.getApplicantsForJob(this.jobId).subscribe((res: ApplicantsResponse) => {
        if (res && res.response) {
            this.applicants = res.response.applicants.map(applicant => ({
                _id: applicant._id,
                email: applicant.email,
                jobTitle: res.response.jobTitle,
                applications: applicant.applications.map(application => ({
                    name: application.name,
                    experience: application.experience,
                    resume: application.resume,
                    createdAt: application.appliedAt
                })),
                duplicates: applicant.duplicates.map(duplicate => ({
                    jobId: duplicate.jobId,
                    jobTitle: duplicate.jobTitle
                })),
                hasDuplicates: applicant.duplicates.length > 0, // Boolean to check if duplicates exist
              showTooltip: false // Initialize tooltip visibility

            }));
            console.log("applicants", this.applicants);
            this.totalApplicants = res.totalApplicants;
            this.extractShortListedId();
            this.jobTitle = res.response.jobTitle;
        } else {
            console.error("Invalid response structure:", res);
        }
    }, (error) => {
        console.error("Error fetching applicants:", error);
    });
}

  

  createShortListedApplicant(applicantId: string, applicantName: string) {
    const modalRef = this.modalService.open(DeleteConfirmationModalComponent);
    modalRef.componentInstance.jobName = applicantName;
    modalRef.componentInstance.modalTitle = 'Confirm ShortList';
    modalRef.componentInstance.modalMessage =
      'Are you sure you want to shortlist this applicant';
    modalRef.componentInstance.confirmed.subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.service
          .createShortlistedApplicant(this.jobId, applicantId)
          .subscribe((res: any) => {
            this.notification.showSuccess('Applicant is ShortListed!');
            this.getAllShortListedApplicants();
            this.getApplicantsForJob();
          });
      }
    });
  }
  shortListedArray: any[] = [];
  shortListedCount: number = 0;

  // getAllShortListedApplicants() {
  //   this.service
  //     .getAllShortListedApplicants(this.jobId)
  //     .subscribe((res: any) => {
  //       this.shortListedArray = res.response.shortListedApplicants;
  //       console.log('shortListed', this.shortListedArray);
  //       this.shortListedCount = res.totalApplicants;
  //       this.extractShortListedId();
  //     });
  // }
  getAllShortListedApplicants() {
    this.service.getAllShortListedApplicants(this.jobId).subscribe((res: ShortApplicantsResponse) => {
        if (res && res.response) {
            this.shortListedArray = res.response.shortListedApplicants.map(applicant => ({
                _id: applicant._id,
                email: applicant.email,
                jobTitle: res.response.jobTitle,
                applications: applicant.applications.map(application => ({
                    name: application.name,
                    experience: application.experience,
                    resume: application.resume,
                    createdAt: application.appliedAt
                }))
            }));
            console.log("shortlistedApplicants",this.shortListedArray)
            this.shortListedCount = res.totalApplicants;
           this.extractShortListedId()
        } else {
            console.error("Invalid response structure:", res);
        }
    }, (error) => {
        console.error("Error fetching applicants:", error);
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
    console.log(this.applicantId)
  }

  testInvited: any[] = [];
  createShortListedApplicantsForJob(applicantId: string, testId: string) {
    this.service
      .createTestInvitedApplicantsForJob(this.jobId, applicantId, testId)
      .subscribe((res: any) => {
        this.testInvited = res.response;
        this.notification.showSuccess('Applicant is Invited For Test!');
        this.getAllTestInvitedApplicants();
      });
  }

  testInvitedArray: any[] = [];
  testInvitedCount: number = 0;

  // getAllTestInvitedApplicants() {
  //   this.service
  //     .getAllTestInvitedApplicants(this.jobId)
  //     .subscribe((res: any) => {
  //       this.testInvitedArray = res.response.testInvitedApplicants;
  //       console.log('testInvited', this.shortListedArray);
  //       this.testInvitedCount = res.totalApplicants;
  //       this.extractTestInvitedId();
  //     });
  // }
  getAllTestInvitedApplicants() {
    this.service.getAllTestInvitedApplicants(this.jobId).subscribe((res: TestInvitedApplicants) => {
        if (res && res.response) {
            this.testInvitedArray = res.response.testInvitedApplicants.map(applicant => ({
                _id: applicant._id,
                email: applicant.email,
                jobTitle: res.response.jobTitle,
                applications: applicant.applications.map(application => ({
                    name: application.name,
                    experience: application.experience,
                    resume: application.resume,
                    createdAt: application.appliedAt
                }))
            }));
            console.log("testInvitedArray",this.testInvitedArray)
            this.testInvitedCount = res.totalApplicants;
           this.extractTestInvitedId()
        } else {
            console.error("Invalid response structure:", res);
        }
    }, (error) => {
        console.error("Error fetching applicants:", error);
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
  createHiredApplicantsForJob(applicantId: string, applicantName: string) {
    const modalRef = this.modalService.open(DeleteConfirmationModalComponent);
    modalRef.componentInstance.jobName = applicantName;
    modalRef.componentInstance.modalTitle = 'Confirm Hire';
    modalRef.componentInstance.modalMessage =
      'Are you sure you want to hire this applicant';
    modalRef.componentInstance.confirmed.subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.service
          .createHiredApplicantsForJob(this.jobId, applicantId)
          .subscribe((res: any) => {
            this.hiredApplicant = res.response;
            this.notification.showSuccess('Applicant is Hired!');
            this.getApplicantsForJob();
            this.getAllHiredApplicants();
          });
      }
    });
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

  onsiteApplicants: any[] = [];
  onsiteApplicantCount: number = 0;
  createOnsiteApplicantsForJob(applicantId: string, applicantName: string) {
    const modalRef = this.modalService.open(DeleteConfirmationModalComponent);
    modalRef.componentInstance.jobName = applicantName;
    modalRef.componentInstance.modalTitle = 'Confirm Onsite Invite';
    modalRef.componentInstance.modalMessage =
      'Are you sure you want to invite this applicant for Onsite Interview';
    modalRef.componentInstance.confirmed.subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.service
          .createOnSiteInviteForJob(this.jobId, applicantId)
          .subscribe((res: any) => {
            console.log(res);
            this.onsiteApplicants = res.response;
            this.notification.showSuccess('Applicant is Invited!');
            this.getApplicantsForJob();
            this.getAllOnsiteApplicants();
          });
      }
    });
  }
  onsiteApplicantArray: any[] = [];
  getAllOnsiteApplicants() {
    this.service.getOnsiteInviteApplicants(this.jobId).subscribe((res: any) => {
      this.onsiteApplicantArray = res.response.invitedApplicants;
      console.log('onsite', this.onsiteApplicantArray);
      this.onsiteApplicantCount = res.totalApplicants;
      this.extractOnsiteId();
    });
  }

  onsiteId: any[] = [];
  extractOnsiteId() {
    this.onsiteId = this.onsiteApplicantArray.map((id) => id._id);
    console.log(this.onsiteId);
  }

  isOnsite(applicantId: string): boolean {
    return this.onsiteId.includes(applicantId);
  }

  downloadResume(resumeId: string) {
    this.resumeLoading[resumeId] = true;
    this.resumeViewLoading[resumeId] = false; // res

    this.service.getFileById(resumeId).subscribe(
      (response: any) => {
        if (response?.data?.webContentLink) {
          // Create an anchor element to trigger the download
          const anchor = document.createElement('a');
          anchor.href = response.data.webContentLink;
          anchor.target = '_blank'; // Optional: opens in a new tab
          // anchor.download = response.data.name; // Optional: filename if needed
          anchor.click();
          this.resumeLoading[resumeId] = false;
        } else {
          console.error('Download link not available');
          this.resumeLoading[resumeId] = false;
        }
      },
      (error: any) => {
        console.error('Error fetching file data:', error);
      }
    );
  }
  // viewResume(resumeId: string) {
  //   this.resumeViewLoading[resumeId] = true;

  //   this.service.getFileById(resumeId).subscribe(
  //     (response: any) => {
  //       console.log(response)
  //       if (response?.data?.webContentLink) {
  //         // Create an anchor element to trigger the download
  //         const anchor = document.createElement('a');
  //         anchor.href = response.data.webViewLink;
  //         anchor.target = '_blank'; // Optional: opens in a new tab
  //         anchor.click();
  //         this.resumeViewLoading[resumeId] = false;

  //       } else {
  //         console.error("View link not available");

  //         this.resumeViewLoading[resumeId] = false;

  //       }
  //     },
  //     (error:any) => {
  //       console.error("Error fetching file data:", error);
  //     }
  //   );
  // }
  viewResume(resumeId: string) {
    this.resumeViewLoading[resumeId] = true;

    this.service.getFileById(resumeId).subscribe(
      (response: any) => {
        console.log(response);
        if (response?.data?.webContentLink) {
          // Create an anchor element to trigger the download
          const anchor = document.createElement('a');
          anchor.href = response.data.webViewLink;
          anchor.target = '_blank'; // Optional: opens in a new tab
          anchor.click();
          this.resumeViewLoading[resumeId] = false;
        } else {
          console.error('View link not available');

          this.resumeViewLoading[resumeId] = false;
        }
      },
      (error: any) => {
        console.error('Error fetching file data:', error);
      }
    );
  }
  private modalService = inject(NgbModal);
  openTestSelectionModal(applicantId: string) {
    // Find the shortlisted applicant's information based on the ID
    const applicant = this.shortListedArray.find(
      (app) => app._id === applicantId
    );

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
        success({
          text: 'Applicant invited for the selected test!',
          delay: 3000,
          width: '300px',
        });
        this.getAllTestInvitedApplicants();
      });
  }
}

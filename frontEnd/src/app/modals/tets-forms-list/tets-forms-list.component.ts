import { Component, Output, EventEmitter, OnInit, Input, inject } from '@angular/core';
import { JobApplicationService } from '../../services/job_application/job-application.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
import { success } from '@pnotify/core';

@Component({
  selector: 'app-tets-forms-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tets-forms-list.component.html',
  styleUrls: ['./tets-forms-list.component.css'],
})
export class TetsFormsListComponent implements OnInit {
  @Output() selectedTest = new EventEmitter<string>();
  @Output() invitationSent = new EventEmitter<void>(); // Emit an event when invitation is sent

  @Input() jobId!: string; // Non-null assertion operator
  testList: any[] = []; // Array of available tests
  @Input() applicantId!: string; // Input for applicant ID
  @Input() applicantName!: string; // Ensure this is defined

  public modal = inject(NgbActiveModal); // Inject NgbActiveModal here

  selectedTestId!: string; // Property to hold the selected test ID

  constructor(private service: JobApplicationService) {}

  ngOnInit() {
    this.fetchTests();
  }

  fetchTests() {
    this.service.getTestsForJob(this.jobId).subscribe((res: any) => {
      this.testList = res.testForms; // Assuming API response contains a list of tests
    });
  }

  sendInvitation(applicantId: string, testId: string) {
    this.service.createTestInvitedApplicantsForJob(this.jobId, applicantId, testId).subscribe((res: any) => {
      success({
        text: 'Applicant invited for the selected test!',
        delay: 3000,
        width: '300px',
      });

      this.invitationSent.emit(); // Emit event to notify parent
      this.closeModal(); // Optional: Close modal after sending invitation
    });
  }

  toggleSelection(testId: string) {
    this.selectedTestId = testId; // Update selected test ID
  }

  openTestPreview(testId: string) {
    console.log(`Previewing test with ID: ${testId}`);
  }

  closeModal() {
    this.modal.dismiss(); // Close the modal
  }
}
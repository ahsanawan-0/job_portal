import { Component, Output, EventEmitter, OnInit, Input, inject } from '@angular/core';
import { JobApplicationService } from '../../services/job_application/job-application.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
import { success } from '@pnotify/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tets-forms-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tets-forms-list.component.html',
  styleUrls: ['./tets-forms-list.component.css'],
})
export class TetsFormsListComponent implements OnInit {
  @Output() selectedTest = new EventEmitter<string>();
  @Output() invitationSent = new EventEmitter<void>(); 

  @Input() jobId!: string; 
  testList: any[] = []; 
  @Input() applicantId!: string; 
  @Input() applicantName!: string; 

  public modal = inject(NgbActiveModal); 

  selectedTestId!: string; 

  constructor(private service: JobApplicationService, private router: Router) {}

  ngOnInit() {
    this.fetchTests();
  }

  fetchTests() {
    this.service.getTestsForJob(this.jobId).subscribe((res: any) => {
      this.testList = res.testForms;
    });
  }

  sendInvitation(applicantId: string, testId: string) {
    this.service.createTestInvitedApplicantsForJob(this.jobId, applicantId, testId).subscribe((res: any) => {
      success({
        text: 'Applicant invited for the selected test!',
        delay: 3000,
        width: '300px',
      });

      this.invitationSent.emit(); 
      this.closeModal(); 
    });
  }

  toggleSelection(testId: string) {
    // If the selected test is the same, deselect it
    if (this.selectedTestId === testId) {
      this.selectedTestId = ''; // Deselect if already selected
    } else {
      this.selectedTestId = testId; // Select the new test
    }
  }

  openTestPreview(testId: string) {
    const url = `http://localhost:4200/test/admin/${testId}`;
    window.open(url, '_blank');
  }

  closeModal() {
    this.modal.dismiss(); 
  }

  redirectToTestPage() {
    this.router.navigate(['/technicalinterview']);
    this.modal.dismiss(); 
  }
}
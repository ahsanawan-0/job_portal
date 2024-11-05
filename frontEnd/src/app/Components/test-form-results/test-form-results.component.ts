import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { PaginationComponent } from '../pagination/pagination.component';
import { Router, ActivatedRoute } from '@angular/router';
import { success, error } from '@pnotify/core';
import '@pnotify/core/dist/PNotify.css';
import '@pnotify/core/dist/BrightTheme.css';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DeleteConfirmationModalComponent } from '../../modals/delete-confirmation-modal/delete-confirmation-modal.component';
import { TestServiceService } from '../../services/test_service/test-service.service';

@Component({
  selector: 'app-test-form-results',
  standalone: true,
  imports: [CommonModule, PaginationComponent],
  templateUrl: './test-form-results.component.html',
  styleUrls: ['./test-form-results.component.css'] // Note: It should be styleUrls, not styleUrl
})
export class TestFormResultsComponent implements OnInit {
  modalService = inject(NgbModal);
  route = inject(Router);
  activatedRoute = inject(ActivatedRoute);
  formId: string = '';
  totalItems: number = 0;
  itemsPerPage = 5;
  currentPage = 1;
  paginatedResults: any[] = [];
  submissions: any[] = []; // Change applicants to submissions
  formTitle: string = '';

  constructor(private service: TestServiceService) {
    this.extractFormId();
  }

  ngOnInit(): void {
    this.getSubmissionsByFormId();
  }

  onClickArrowLeft() {
    this.route.navigateByUrl('technicalinterview');
  }

  extractFormId(): void {
    this.activatedRoute.params.subscribe((params) => {
      this.formId = params['formId'];
      console.log('Extracted formId:', this.formId);
    });
  }

  onClickViewAnswers(submissionId: string) {
    this.route.navigateByUrl(`applicant-test-submission/${submissionId}`); // Adjusted to use submissionId
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.updatePaginatedResults(); // Update pagination logic
  }

  getSubmissionsByFormId() {
    this.service.getApplicantsByFormId(this.formId, this.currentPage, this.itemsPerPage).subscribe((res: any) => {
      this.submissions = res.submissions; // Get submissions from the response
      this.formTitle = res.title; // Get the form title (or formId if that's intended)
      this.totalItems = res.total; // Total number of submissions
      console.log(this.totalItems);
      this.updatePaginatedResults();
    });
  }

  updatePaginatedResults(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedResults = this.submissions.slice(startIndex, endIndex); // Paginate submissions
  }

  dropdownIndex: number | null = null;
  onClickThreeDots(index: number) {
    this.dropdownIndex = this.dropdownIndex === index ? null : index;
  }

  onDelete(submissionId: string, applicantName: string) {
    const modalRef = this.modalService.open(DeleteConfirmationModalComponent);
    modalRef.componentInstance.jobName = applicantName;
    modalRef.componentInstance.modalTitle = 'Confirm Deletion';
    modalRef.componentInstance.modalMessage =
      'Are you sure you want to delete this submission?';
    modalRef.componentInstance.confirmed.subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.service.deleteApplicant(submissionId).subscribe((res: any) => {
          if (res.message) {
            success({
              text: 'Submission is Deleted!',
              delay: 3000,
              width: '300px',
            });
            this.dropdownIndex = null;
            this.getSubmissionsByFormId(); // Refresh the submissions list
          } else {
            error({
              text: 'Error in Deleting Submission',
              delay: 3000,
              width: '300px',
            });
          }
        });
      }
    });
  }
}
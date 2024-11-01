import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { PaginationComponent } from '../pagination/pagination.component';
import { Router, ActivatedRoute } from '@angular/router';
import { ExitInterviewService } from '../../services/exit_interview/exit-interview.service';
import { success, error } from '@pnotify/core';
import '@pnotify/core/dist/PNotify.css';
import '@pnotify/core/dist/BrightTheme.css';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DeleteConfirmationModalComponent } from '../../modals/delete-confirmation-modal/delete-confirmation-modal.component';

@Component({
  selector: 'app-exit-interview-result',
  standalone: true,
  imports: [CommonModule, PaginationComponent],
  templateUrl: './exit-interview-result.component.html',
  styleUrl: './exit-interview-result.component.css',
})
export class ExitInterviewResultComponent implements OnInit {
  modalService = inject(NgbModal);
  route = inject(Router);
  activatedRoute = inject(ActivatedRoute);
  uniqueLinkId: string = '';
  onClickArrowLeft() {
    this.route.navigateByUrl('exitinterview');
  }

  onClickViewAnswers(applicantId: string) {
    this.route.navigateByUrl(`exitApplicantInfo/${applicantId}`);
  }

  totalItems: number = 0;
  itemsPerPage = 5;
  currentPage = 1;
  paginatedResults: number[] = [];

  constructor() {
    this.updatePaginatedJobs();
    this.extractUniqueLinkId();
  }

  ngOnInit(): void {
    this.getApplicantsByFormId();
  }

  extractUniqueLinkId(): void {
    this.activatedRoute.params.subscribe((params) => {
      this.uniqueLinkId = params['uniqueLinkId'];
      console.log('Extracted uniqueLinkId:', this.uniqueLinkId);
    });
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.getApplicantsByFormId();
  }

  service = inject(ExitInterviewService);
  applicants: any[] = [];
  formTitle: string = '';
  getApplicantsByFormId() {
    this.service
      .getApplicantsByFormId(
        this.uniqueLinkId,
        this.currentPage,
        this.itemsPerPage
      )
      .subscribe((res: any) => {
        this.applicants = res.applicants.applicants;
        this.formTitle = res.applicants.title;
        this.totalItems = res.totalApplicants;
        console.log(this.totalItems);

        this.updatePaginatedJobs();
      });
  }

  updatePaginatedJobs(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedResults = this.applicants;
  }

  dropdownIndex: number | null = null;
  onClickThreeDots(index: number) {
    if (this.dropdownIndex === index) {
      this.dropdownIndex = null;
    } else {
      this.dropdownIndex = index;
    }
  }

  onDelete(applicantId: string, applicantName: string) {
    const modalRef = this.modalService.open(DeleteConfirmationModalComponent);
    modalRef.componentInstance.jobName = applicantName;
    modalRef.componentInstance.modalTitle = 'Confirm Deletion';
    modalRef.componentInstance.modalMessage =
      'Are you sure you want to delete this Applicant';
    modalRef.componentInstance.confirmed.subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.service.deleteExitApplicant(applicantId).subscribe((res: any) => {
          if (res.message) {
            success({
              text: 'Applicant is Deleted!',
              delay: 3000,
              width: '300px',
            });
            this.dropdownIndex = null;
            this.getApplicantsByFormId();
          } else {
            error({
              text: 'Error in Deleting Form',
              delay: 3000,
              width: '300px',
            });
          }
        });
      }
    });
  }
}

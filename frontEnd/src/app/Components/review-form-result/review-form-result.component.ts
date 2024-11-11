import { Component, inject, OnInit } from '@angular/core';
import { ReviewFormService } from '../../services/review_Form/review-form.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DeleteConfirmationModalComponent } from '../../modals/delete-confirmation-modal/delete-confirmation-modal.component';
import { NotificationService } from '../../services/notification/notification.service';

@Component({
  selector: 'app-review-form-result',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './review-form-result.component.html',
  styleUrl: './review-form-result.component.css',
})
export class ReviewFormResultComponent implements OnInit {
  modalService = inject(NgbModal);
  service = inject(ReviewFormService);
  notification = inject(NotificationService);
  activatedRoute = inject(ActivatedRoute);
  route = inject(Router);
  uniqueLinkId: string = '';

  dropdownIndex: number | null = null;
  onClickThreeDots(index: number) {
    if (this.dropdownIndex === index) {
      this.dropdownIndex = null;
    } else {
      this.dropdownIndex = index;
    }
  }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params) => {
      this.uniqueLinkId = params['uniqueLinkId'];
    });
    this.getFormApplicants();
  }

  formTitle: string = '';
  totalApplicants: number = 0;
  applicants: any[] = [];
  getFormApplicants() {
    this.service
      .getApplicantsByFormId(this.uniqueLinkId)
      .subscribe((res: any) => {
        this.applicants = res.applicants;
        this.formTitle = res.title;

        this.totalApplicants = res.totalApplicants;
      });
  }

  onClickViewAnswers(applicantId: string) {
    this.route.navigateByUrl(`reviewFormAnswers/${applicantId}`);
  }

  onClickBack() {
    this.route.navigateByUrl('reviewForm');
  }

  onDelete(applicantId: string) {
    const modalRef = this.modalService.open(DeleteConfirmationModalComponent);
    modalRef.componentInstance.jobName = 'Applicant';
    modalRef.componentInstance.modalTitle = 'Confirm Deletion';
    modalRef.componentInstance.modalMessage =
      'Are you sure you want to delete this Review Form';
    modalRef.componentInstance.confirmed.subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.service
          .deleteReviewFormApplicant(applicantId)
          .subscribe((res: any) => {
            if (res.message) {
              this.notification.showSuccess(res.message);
              this.dropdownIndex = null;
              this.getFormApplicants();
            } else {
              this.notification.showError(res.message);
            }
          });
      }
    });
  }
}

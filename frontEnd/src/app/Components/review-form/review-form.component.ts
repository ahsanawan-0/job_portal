import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { ReviewFormService } from '../../services/review_Form/review-form.service';
import { NotificationService } from '../../services/notification/notification.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ExitInterviewModalComponent } from '../../modals/exit-interview-modal/exit-interview-modal.component';
import { DeleteConfirmationModalComponent } from '../../modals/delete-confirmation-modal/delete-confirmation-modal.component';
import { DynamicFormComponent } from '../dynamic-form/dynamic-form.component';
import { DynamicCreateFormComponent } from '../dynamic-create-form/dynamic-create-form.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-review-form',
  standalone: true,
  imports: [CommonModule, DynamicFormComponent, DynamicCreateFormComponent],
  templateUrl: './review-form.component.html',
  styleUrl: './review-form.component.css',
})
export class ReviewFormComponent implements OnInit {
  service = inject(ReviewFormService);
  notification = inject(NotificationService);
  modalService = inject(NgbModal);
  route = inject(Router);

  ngOnInit(): void {
    this.getAllReviewForms();
  }

  forms: any[] = [];
  getAllReviewForms() {
    this.service.getAllReviewForms().subscribe((res: any) => {
      this.forms = res.response;
      console.log(this.forms);
    });
  }

  deleteFormById(uniqueLinkId: string, formTitle: string) {
    const modalRef = this.modalService.open(DeleteConfirmationModalComponent);
    modalRef.componentInstance.jobName = formTitle;
    modalRef.componentInstance.modalTitle = 'Confirm Deletion';
    modalRef.componentInstance.modalMessage =
      'Are you sure you want to delete this form';
    modalRef.componentInstance.confirmed.subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.service.deleteReviewForm(uniqueLinkId).subscribe((res: any) => {
          if (res) {
            this.notification.showSuccess(res.message);

            this.getAllReviewForms();
          } else {
            this.notification.showError(res.message);
          }
        });
      }
    });
  }

  openModal(uniqueLinkId: string, formTitle: string) {
    const modalRef = this.modalService.open(ExitInterviewModalComponent);
    modalRef.componentInstance.link = `http://localhost:4200/exitInterviewViewForm/${uniqueLinkId}`;
    modalRef.componentInstance.title = formTitle;
    modalRef.componentInstance.name = 'Review Form';
  }

  onClickViewResults(uniqueLinkId: string) {}
  onClickViewDetail(uniqueLinkId: string) {}
  onClickCreateForm() {
    this.route.navigateByUrl('reviewForm/create');
  }

  createReviewForm(form: any) {
    this.service.createReviewForm(form).subscribe((res: any) => {
      if (res) {
        this.notification.showSuccess(res.message);
        this.openModal(form.uniqueLinkId, form.title);
      } else {
        this.notification.showError(res.message);
      }
    });
  }
}

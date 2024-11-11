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
import { ReviewFormAdminViewComponent } from '../review-form-admin-view/review-form-admin-view.component';

interface Question {
  label: string;
  type: string;
  options: string[];
}

interface FormData {
  _id: string;
  title: string;
  questions: Question[];
  uniqueLinkId: string;
}

@Component({
  selector: 'app-review-form',
  standalone: true,
  imports: [
    CommonModule,
    DynamicFormComponent,
    DynamicCreateFormComponent,
    ReviewFormAdminViewComponent,
  ],
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

    console.log(this.isAdminView);
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
    modalRef.componentInstance.link = `http://localhost:4200/reviewFormViewer/${uniqueLinkId}`;
    modalRef.componentInstance.title = formTitle;
    modalRef.componentInstance.name = 'Review Form';
  }

  openModal2() {
    const modalRef = this.modalService.open(ExitInterviewModalComponent);
    modalRef.componentInstance.link = `http://localhost:4200/reviewFormViewer/${this.uniqueLinkId}`;
    modalRef.componentInstance.title = this.formTitle;
    modalRef.componentInstance.name = 'Review Form';
  }

  onClickViewResults(uniqueLinkId: string) {
    this.route.navigateByUrl(`reviewFormResults/${uniqueLinkId}`);
  }
  linkId: string = '';
  onClickViewDetail(uniqueLinkId: string) {
    // this.route.navigateByUrl(`reviewFormAdminView/${uniqueLinkId}`);

    this.isAdminView = true;

    this.isCreatingForm = true;

    this.linkId = uniqueLinkId;
    this.getFormById();
    console.log(this.linkId);
  }

  uniqueLinkId: string = '';
  formTitle: string = '';
  createReviewForm(form: any) {
    this.service.createReviewForm(form).subscribe((res: any) => {
      if (res) {
        this.notification.showSuccess(res.message);
        this.getAllReviewForms();
        this.uniqueLinkId = res.form.uniqueLinkId;
        this.formTitle = res.form.title;
        this.openModal2();
      } else {
        this.notification.showError(res.message);
      }
    });
  }

  formData: FormData = {
    _id: '',
    title: '',
    questions: [],
    uniqueLinkId: '',
  };
  getFormById() {
    this.service.getFormbyId(this.linkId).subscribe((res: any) => {
      console.log(res);
      this.formData = res.response;
      console.log(this.formData);
    });
  }

  updateForm(formData: any) {
    this.service.updateForm(formData).subscribe((res: any) => {
      if (res) {
        this.notification.showSuccess(res.message);
        this.getAllReviewForms();
      } else {
        this.notification.showError(res.message);
      }
    });
  }

  isCreatingForm: boolean = false;

  onClickCreateForm() {
    this.isCreatingForm = true;
  }

  onClickBack() {
    this.isCreatingForm = false;
  }

  onClickBackAdminView() {
    this.isCreatingForm = false;
    this.isAdminView = false;
  }

  isAdminView: boolean = false;

  onClickAdminView() {
    this.isAdminView = true;
  }
}

import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DeleteConfirmationModalComponent } from '../../modals/delete-confirmation-modal/delete-confirmation-modal.component';
import { ExitInterviewModalComponent } from '../../modals/exit-interview-modal/exit-interview-modal.component';
import { TestServiceService } from '../../services/test_service/test-service.service';
import { CommonModule } from '@angular/common';
import { NotificationService } from '../../services/notification/notification.service';

@Component({
  selector: 'app-form-card',
  standalone:true,
  templateUrl: './form-card.component.html',
  styleUrls: ['./form-card.component.css'],
  imports:[CommonModule]
})
export class FormCardComponent {
  @Input() forms: any[] = []; 
  @Output() formDeleted = new EventEmitter<void>();

  dropdownIndex: number | null = null;

  constructor(private route: Router, private modalService: NgbModal, private service: TestServiceService) {}

  onClickViewResults(formId: string) {
    this.route.navigateByUrl(`test-applicants-list/${formId}`);
  }
  
  onClickEdit(formId: string) {
    this.route.navigateByUrl(`edit-test/${formId}`);
  }

  onClickThreeDots(index: number) {
    this.dropdownIndex = this.dropdownIndex === index ? null : index;
  }
notification=inject(NotificationService)

  deleteFormById(formId: string, formTitle: string) {
    const modalRef = this.modalService.open(DeleteConfirmationModalComponent);
    modalRef.componentInstance.jobName = formTitle;
    modalRef.componentInstance.modalTitle = 'Confirm Deletion';
    modalRef.componentInstance.modalMessage = 'Are you sure you want to delete this form?';
    // Adding success and error handling
modalRef.componentInstance.confirmed.subscribe((confirmed: boolean) => {
  if (confirmed) {
    this.service.deleteGeneratedForm(formId).subscribe({
      next: (res: any) => {
        this.formDeleted.emit(); // Emit event when deletion is successful
        this.notification.showSuccess('Form deleted successfully!');

      },
      error: (err) => {
        this.notification.showError('Failed to delete the form. Please try again.');
        console.error('Error deleting form:', err);
      }
    });
  }
});
  }

  openModal(formId: string) {
    const modalRef = this.modalService.open(ExitInterviewModalComponent);
    modalRef.componentInstance.link = `http://localhost:4200/test/user/${formId}`;
  }
}
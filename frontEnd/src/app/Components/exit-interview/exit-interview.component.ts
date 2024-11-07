import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ExitInterviewService } from '../../services/exit_interview/exit-interview.service';
import { success, error } from '@pnotify/core';
import '@pnotify/core/dist/PNotify.css';
import '@pnotify/core/dist/BrightTheme.css';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ExitInterviewModalComponent } from '../../modals/exit-interview-modal/exit-interview-modal.component';
import { DeleteConfirmationModalComponent } from '../../modals/delete-confirmation-modal/delete-confirmation-modal.component';

@Component({
  selector: 'app-exit-interview',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './exit-interview.component.html',
  styleUrl: './exit-interview.component.css',
})
export class ExitInterviewComponent implements OnInit {
  route = inject(Router);
  modalService = inject(NgbModal);
  onClickViewResults(uniqueLinkId: string) {
    this.route.navigateByUrl(`exitInterviewResult/${uniqueLinkId}`);
  }

  onClickViewDetail(uniqueLinkId: string) {
    this.route.navigateByUrl(`exitFormdetail/adminView/${uniqueLinkId}`);
  }

  onClickCreateForm() {
    this.route.navigateByUrl('exitInterviewForm');
  }

  ngOnInit(): void {
    this.getAllExitInterviewForms();
  }

  service = inject(ExitInterviewService);
  applicants: any[] = [];
  formTitle: string = '';

  getAllExitInterviewForms() {
    this.service.getAllExitInterviewForms().subscribe((res: any) => {
      this.applicants = res.response;
    });
  }

  dropdownIndex: number | null = null;
  onClickThreeDots(index: number) {
    if (this.dropdownIndex === index) {
      this.dropdownIndex = null;
    } else {
      this.dropdownIndex = index;
    }
  }

  deleteFormById(uniqueLinkId: string, formTitle: string) {
    const modalRef = this.modalService.open(DeleteConfirmationModalComponent);
    modalRef.componentInstance.jobName = formTitle;
    modalRef.componentInstance.modalTitle = 'Confirm Deletion';
    modalRef.componentInstance.modalMessage =
      'Are you sure you want to delete this form';
    modalRef.componentInstance.confirmed.subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.service.deleteFormById(uniqueLinkId).subscribe((res: any) => {
          if (res.message) {
            success({
              text: 'Form is Deleted!',
              delay: 3000,
              width: '300px',
            });
            this.dropdownIndex = null;
            this.getAllExitInterviewForms();
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

  openModal(uniqueLinkId: string, formTitle: string) {
    const modalRef = this.modalService.open(ExitInterviewModalComponent);
    modalRef.componentInstance.link = `http://localhost:4200/exitInterviewViewForm/${uniqueLinkId}`;
    modalRef.componentInstance.title = formTitle;
    modalRef.componentInstance.name = 'Exit Interviews';
  }
}

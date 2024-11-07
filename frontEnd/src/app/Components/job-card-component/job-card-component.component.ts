import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { jobCard } from '../../models/jobModel';
import { Router } from '@angular/router';
import { CreateJobService } from '../../services/create_job/create-job.service';
import { success, error } from '@pnotify/core';
import '@pnotify/core/dist/PNotify.css';
import '@pnotify/core/dist/BrightTheme.css';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ExitInterviewModalComponent } from '../../modals/exit-interview-modal/exit-interview-modal.component';
import { DeleteConfirmationModalComponent } from '../../modals/delete-confirmation-modal/delete-confirmation-modal.component';
import { CapitalizeWordsPipe } from '../../Pipes/capitalize-words.pipe';

@Component({
  selector: 'app-job-card-component',
  standalone: true,
  imports: [CommonModule, CapitalizeWordsPipe],
  templateUrl: './job-card-component.component.html',
  styleUrl: './job-card-component.component.css',
})
export class JobCardComponentComponent {
  modalService = inject(NgbModal);
  // dropdown: boolean = false;
  // onClickThreeDots() {
  //   this.dropdown = !this.dropdown;
  //   console.log(this.dropdown);
  // }
  @Input() jobs: jobCard[] = [];
  @Output() jobAction = new EventEmitter<void>();

  // @Input() onViewApplications: () => void = () => {};

  dropdownIndex: number | null = null;
  onClickThreeDots(index: number) {
    if (this.dropdownIndex === index) {
      this.dropdownIndex = null;
    } else {
      this.dropdownIndex = index;
    }
  }

  service = inject(CreateJobService);

  markAsExpired(jobId: string, jobName: string) {
    const modalRef = this.modalService.open(DeleteConfirmationModalComponent);
    modalRef.componentInstance.jobName = jobName;
    modalRef.componentInstance.modalTitle = 'Confirm Expiration';
    modalRef.componentInstance.modalMessage =
      'Are you sure you want to expire this job';

    modalRef.componentInstance.confirmed.subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.service.updateJobStatus(jobId, 'Expired').subscribe((res: any) => {
          if (res.message) {
            success({
              text: 'Job is Expired!',
              delay: 3000,
              width: '300px',
            });
            this.jobAction.emit();
          }
        });
      }
    });
  }

  OnClickDelete(jobId: string, jobName: string) {
    const modalRef = this.modalService.open(DeleteConfirmationModalComponent);
    modalRef.componentInstance.jobName = jobName;
    modalRef.componentInstance.modalTitle = 'Confirm Deletion';
    modalRef.componentInstance.modalMessage =
      'Are you sure you want to delete this job';

    modalRef.componentInstance.confirmed.subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.service.deleteJob(jobId).subscribe((res: any) => {
          if (res.message) {
            success({
              text: res.message,
              delay: 3000,
              width: '300px',
            });
            this.jobAction.emit();
            this.dropdownIndex = null;
          } else {
            error({
              text: res.message,
              delay: 3000,
              width: '300px',
            });
          }
        });
      }
    });
  }

  route = inject(Router);
  onClickViewApplication(jobId: string) {
    this.route.navigateByUrl(`job-applications/${jobId}`);
  }

  onClickViewDetail(jobId: string) {
    this.route.navigateByUrl(`jobdetail/admin/${jobId}`);
  }

  openModal(jobId: string, jobTitle: string) {
    const modalRef = this.modalService.open(ExitInterviewModalComponent);
    modalRef.componentInstance.link = `http://localhost:4200/jobdetail/user/${jobId}`;
    modalRef.componentInstance.title = jobTitle;
    modalRef.componentInstance.name = 'Job';
  }
}

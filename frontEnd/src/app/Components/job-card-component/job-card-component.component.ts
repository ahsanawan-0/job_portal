import { CommonModule } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
import { jobCard } from '../../models/jobModel';
import { Router } from '@angular/router';
import { CreateJobService } from '../../services/create_job/create-job.service';
import { success, error } from '@pnotify/core';
import '@pnotify/core/dist/PNotify.css';
import '@pnotify/core/dist/BrightTheme.css';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ExitInterviewModalComponent } from '../../modals/exit-interview-modal/exit-interview-modal.component';

@Component({
  selector: 'app-job-card-component',
  standalone: true,
  imports: [CommonModule],
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

  markAsExpired(jobId: string) {
    this.service.updateJobStatus(jobId, 'Expired').subscribe((res: any) => {
      if (res.message) {
        success({
          text: 'Job is Expired!',
          delay: 3000,
          width: '300px',
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

  openModal(jobId: string) {
    const modalRef = this.modalService.open(ExitInterviewModalComponent);
    modalRef.componentInstance.link = `http://localhost:4200/jobdetail/user/${jobId}`;
  }
}

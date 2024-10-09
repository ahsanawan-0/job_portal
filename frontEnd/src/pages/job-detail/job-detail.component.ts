import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ApplyJobModalComponent } from '../../modals/apply-job-modal/apply-job-modal.component';
import { FormsModule } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-job-detail',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './job-detail.component.html',
  styleUrls: ['./job-detail.component.css'],
  
})
export class JobDetailComponent {
  private modalService = inject(NgbModal);
  openApplyModal() {
    const modalRef = this.modalService.open(ApplyJobModalComponent);
  }
}

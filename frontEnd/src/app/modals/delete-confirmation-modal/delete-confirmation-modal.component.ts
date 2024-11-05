import { Component, Input, Output, EventEmitter } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-delete-confirmation-modal',
  standalone: true,
  templateUrl: './delete-confirmation-modal.component.html',
  styleUrls: ['./delete-confirmation-modal.component.css'],
  imports: [],
})
export class DeleteConfirmationModalComponent {
  @Input() jobName: string = '';
  @Input() modalTitle: string = 'Confirm Deletion';
  @Input() modalMessage: string = 'Are you sure you want to delete this job';
  @Output() confirmed = new EventEmitter<boolean>();

  constructor(public activeModal: NgbActiveModal) {}

  confirmDelete() {
    this.confirmed.emit(true);
    this.activeModal.close();
  }

  cancel() {
    this.confirmed.emit(false);
    this.activeModal.dismiss();
  }
}
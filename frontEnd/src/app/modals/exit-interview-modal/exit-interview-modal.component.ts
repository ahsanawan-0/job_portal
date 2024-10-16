import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-exit-interview-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './exit-interview-modal.component.html',
  styleUrls: ['./exit-interview-modal.component.css']  // Corrected property name
})
export class ExitInterviewModalComponent {
  private subscriptions: Subscription = new Subscription();

  public activeModal = inject(NgbActiveModal);  // Inject NgbActiveModal
  copyLink() {
    const link = 'https://www.jobportalbysdsol.com/exitinterviewuiuxdesigner';
    navigator.clipboard.writeText(link).then(() => {
      alert('Link copied to clipboard!');
    }).catch(err => {
      console.error('Failed to copy: ', err);
    });
  }

  closeModal(): void {
    this.activeModal.dismiss();  // Used NgbActiveModal to close the modal
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();  // Clean up subscriptions
  }
}
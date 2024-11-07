import { CommonModule } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-exit-interview-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './exit-interview-modal.component.html',
  styleUrls: ['./exit-interview-modal.component.css'],
})
export class ExitInterviewModalComponent {
  private subscriptions: Subscription = new Subscription();

  public activeModal = inject(NgbActiveModal);

  @Input() link: string = ''; // Property to hold the link
  @Input() title: string = '';
  @Input() name: string = '';

  copyLink() {
    navigator.clipboard
      .writeText(this.link)
      .then(() => {
        alert('Link copied to clipboard!');
      })
      .catch((err) => {
        console.error('Failed to copy: ', err);
      });
  }

  closeModal(): void {
    this.activeModal.dismiss();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}

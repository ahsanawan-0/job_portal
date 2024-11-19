import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-date-time-modal',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './date-time-modal.component.html',
  styleUrl: './date-time-modal.component.css',
})
export class DateTimeModalComponent {
  selectedDate: string | null = null;
  selectedTime: string | null = null;
  modalService = inject(NgbModal);

  constructor(public activeModal: NgbActiveModal) {}

  save() {
    if (!this.selectedDate || !this.selectedTime) {
      alert('Please select both date and time.');
      return;
    }

    const date = new Date(this.selectedDate);
    const formattedDate = date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });

    const [hours, minutes] = this.selectedTime.split(':').map(Number);
    const timePeriod = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 || 12;
    const formattedTime = `${formattedHours}:${minutes
      .toString()
      .padStart(2, '0')} ${timePeriod}`;
    const interviewDateTime = {
      date: formattedDate,
      time: formattedTime,
    };

    this.activeModal.close(interviewDateTime);
  }

  dismiss() {
    this.activeModal.dismiss('Modal dismissed');
  }
}

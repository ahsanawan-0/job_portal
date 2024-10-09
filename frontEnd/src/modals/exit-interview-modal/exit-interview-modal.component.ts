import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-exit-interview-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './exit-interview-modal.component.html',
  styleUrl: './exit-interview-modal.component.css'
})
export class ExitInterviewModalComponent {
  isVisible = true; // Toggle modal visibility

  copyLink() {
    const link = 'https://www.jobportalbysdsol.com/exitinterviewuiuxdesigner';
    navigator.clipboard.writeText(link).then(() => {
      alert('Link copied to clipboard!');
    }).catch(err => {
      console.error('Failed to copy: ', err);
    });
  }


  closeModal() {
    this.isVisible = false;
  }
}

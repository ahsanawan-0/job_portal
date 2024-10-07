import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ApplyJobModalComponent } from '../../Components/apply-job-modal/apply-job-modal.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-job-detail',
  standalone: true,
  imports: [CommonModule,ApplyJobModalComponent],
  templateUrl: './job-detail.component.html',
  styleUrl: './job-detail.component.css'
})
export class JobDetailComponent {
  isApplyModalVisible = false;

  openApplyModal() {
    this.isApplyModalVisible = true;
  }
}

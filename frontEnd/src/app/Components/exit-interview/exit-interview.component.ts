import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ExitInterviewService } from '../../services/exit_interview/exit-interview.service';
import { success, error } from '@pnotify/core';
import '@pnotify/core/dist/PNotify.css';
import '@pnotify/core/dist/BrightTheme.css';

@Component({
  selector: 'app-exit-interview',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './exit-interview.component.html',
  styleUrl: './exit-interview.component.css',
})
export class ExitInterviewComponent implements OnInit {
  route = inject(Router);
  onClickViewResults(uniqueLinkId: string) {
    this.route.navigateByUrl(`exitInterviewResult/${uniqueLinkId}`);
  }

  onClickCreateForm() {
    this.route.navigateByUrl('exitInterviewForm');
  }

  ngOnInit(): void {
    this.getAllExitInterviewForms();
  }

  service = inject(ExitInterviewService);
  applicants: any[] = [];
  count: number = 0;
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

  deleteFormById(uniqueLinkId: string) {
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
}

import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ExitInterviewService } from '../../services/exit_interview/exit-interview.service';

@Component({
  selector: 'app-exit-interview',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './exit-interview.component.html',
  styleUrl: './exit-interview.component.css',
})
export class ExitInterviewComponent implements OnInit {
  route = inject(Router);
  onClickViewResults() {
    this.route.navigateByUrl('exitInterviewResult');
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
      console.log(this.applicants);
    });
  }
}

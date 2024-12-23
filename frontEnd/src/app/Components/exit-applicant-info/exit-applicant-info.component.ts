import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ExitInterviewService } from '../../services/exit_interview/exit-interview.service';

@Component({
  selector: 'app-exit-applicant-info',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './exit-applicant-info.component.html',
  styleUrl: './exit-applicant-info.component.css',
})
export class ExitApplicantInfoComponent implements OnInit {
  activatedRoute = inject(ActivatedRoute);
  applicantId: string = '';
  extractApplicantId(): void {
    this.activatedRoute.params.subscribe((params) => {
      this.applicantId = params['applicantId'];
      console.log('Extracted applicantId:', this.applicantId);
    });
  }

  ngOnInit(): void {
    this.extractApplicantId();
    this.getApplicantQuestionsAndAnswers();
  }

  service = inject(ExitInterviewService);
  answers: any[] = [];
  name: string = '';
  employeeId: string = '';
  uniqueLinkId: string = '';
  getApplicantQuestionsAndAnswers() {
    this.service
      .getApplicantQuestionsAndAnswers(this.applicantId)
      .subscribe((res: any) => {
        this.answers = res.answers;
        this.name = res.employeeName;
        this.employeeId = res.employeeId;
        this.uniqueLinkId = res.uniqueLinkId;
      });
  }

  route = inject(Router);
  onClickBack() {
    this.route.navigateByUrl(`exitInterviewResult/${this.uniqueLinkId}`);
  }
}

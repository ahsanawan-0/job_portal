import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { PaginationComponent } from '../pagination/pagination.component';
import { Router, ActivatedRoute } from '@angular/router';
import { ExitInterviewService } from '../../services/exit_interview/exit-interview.service';

@Component({
  selector: 'app-exit-interview-result',
  standalone: true,
  imports: [CommonModule, PaginationComponent],
  templateUrl: './exit-interview-result.component.html',
  styleUrl: './exit-interview-result.component.css',
})
export class ExitInterviewResultComponent implements OnInit {
  route = inject(Router);
  activatedRoute = inject(ActivatedRoute);
  uniqueLinkId: string = '';
  onClickArrowLeft() {
    this.route.navigateByUrl('exitinterview');
  }

  onClickViewAnswers(applicantId: string) {
    this.route.navigateByUrl(`exitApplicantInfo/${applicantId}`);
  }

  totalItems: number = 0;
  itemsPerPage = 5;
  currentPage = 1;
  paginatedResults: number[] = [];

  constructor() {
    this.updatePaginatedJobs();
    this.extractUniqueLinkId();
  }

  ngOnInit(): void {
    this.getApplicantsByFormId();
  }

  extractUniqueLinkId(): void {
    this.activatedRoute.params.subscribe((params) => {
      this.uniqueLinkId = params['uniqueLinkId'];
      console.log('Extracted uniqueLinkId:', this.uniqueLinkId);
    });
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.getApplicantsByFormId();
  }

  service = inject(ExitInterviewService);
  applicants: any[] = [];
  formTitle: string = '';
  getApplicantsByFormId() {
    this.service
      .getApplicantsByFormId(
        this.uniqueLinkId,
        this.currentPage,
        this.itemsPerPage
      )
      .subscribe((res: any) => {
        this.applicants = res.applicants.applicants;
        this.formTitle = res.applicants.title;
        this.totalItems = res.totalApplicants;
        console.log(this.totalItems);

        this.updatePaginatedJobs();
      });
  }

  updatePaginatedJobs(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedResults = this.applicants;
  }
}

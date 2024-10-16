import { CommonModule, UpperCasePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { PaginationComponent } from '../pagination/pagination.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-my-jobs',
  standalone: true,
  imports: [UpperCasePipe, CommonModule, PaginationComponent],
  templateUrl: './my-jobs.component.html',
  styleUrl: './my-jobs.component.css',
})
export class MyJobsComponent {
  route = inject(Router);
  onClickPostJob() {
    this.route.navigateByUrl('createJobPost');
  }

  dropdownIndex: number | null = null;

  jobs = Array.from({ length: 30 }, (_, i) => i + 1);
  itemsPerPage = 12;
  currentPage = 1;
  paginatedJobs: number[] = [];

  constructor() {
    this.updatePaginatedJobs();
  }

  onClickThreeDots(index: number) {
    if (this.dropdownIndex === index) {
      this.dropdownIndex = null;
    } else {
      this.dropdownIndex = index;
    }
  }

  onClickViewApplication() {
    this.route.navigateByUrl('job-applications');
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.updatePaginatedJobs();
  }

  updatePaginatedJobs(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedJobs = this.jobs.slice(startIndex, endIndex);
  }
}
